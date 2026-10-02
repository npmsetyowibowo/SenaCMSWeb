import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Article, Category, Tag, Portfolio, Testimonial, PricingPlan, FAQ, Media, Page, Inquiry, TrafficLog, User, Session, SeoMetadata, CityLanding } from './types';
import { getInitialSeedData, getInitialCities } from './seed';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'senaweb_db.json');

// Memory cache for fast SSR queries with file sync
let memoryDb: DatabaseSchema | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDb(): DatabaseSchema {
  if (memoryDb) {
    if (!memoryDb.cities) {
      memoryDb.cities = getInitialCities();
      saveDb(memoryDb);
    }
    return memoryDb;
  }

  ensureDataDirectory();

  if (!fs.existsSync(DB_FILE)) {
    const seed = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    memoryDb = seed;
    return seed;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDb = JSON.parse(raw);
    if (!memoryDb!.cities) {
      memoryDb!.cities = getInitialCities();
      saveDb(memoryDb!);
    }
    return memoryDb!;
  } catch (error) {
    console.error('Error reading database file, re-seeding:', error);
    const seed = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    memoryDb = seed;
    return seed;
  }
}

export function saveDb(db: DatabaseSchema): void {
  ensureDataDirectory();
  memoryDb = db;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to persist database file:', error);
  }
}

// ----------------- USERS & AUTH -----------------
export async function getUserByUsername(username: string): Promise<User | undefined> {
  const db = getDb();
  return db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = getDb();
  return db.users.find(u => u.id === id);
}

export async function updateUser(id: number, data: Partial<User>): Promise<User | null> {
  const db = getDb();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return null;
  db.users[index] = {
    ...db.users[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  saveDb(db);
  return db.users[index];
}

// ----------------- SESSIONS -----------------
export async function createSession(userId: number, token: string): Promise<Session> {
  const db = getDb();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const newSession: Session = {
    id: db.sessions.length > 0 ? Math.max(...db.sessions.map(s => s.id)) + 1 : 1,
    token,
    user_id: userId,
    expires_at: expiresAt,
    created_at: now.toISOString(),
  };

  db.sessions.push(newSession);
  saveDb(db);
  return newSession;
}

export async function getSessionByToken(token: string): Promise<(Session & { user: User }) | null> {
  const db = getDb();
  const session = db.sessions.find(s => s.token === token);
  if (!session) return null;

  if (new Date(session.expires_at) < new Date()) {
    // expired
    db.sessions = db.sessions.filter(s => s.token !== token);
    saveDb(db);
    return null;
  }

  const user = db.users.find(u => u.id === session.user_id);
  if (!user) return null;

  return { ...session, user };
}

export async function deleteSession(token: string): Promise<void> {
  const db = getDb();
  db.sessions = db.sessions.filter(s => s.token !== token);
  saveDb(db);
}

// ----------------- ARTICLES & RELATIONS -----------------
export interface ArticleWithRelations extends Article {
  category?: Category;
  tags?: Tag[];
  author?: {
    id: number;
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export function populateArticle(article: Article, db: DatabaseSchema): ArticleWithRelations {
  const category = db.categories.find(c => c.id === article.category_id);
  const tagIds = db.article_tags.filter(at => at.article_id === article.id).map(at => at.tag_id);
  const tags = db.tags.filter(t => tagIds.includes(t.id));
  const authorUser = db.users.find(u => u.id === article.author_id);
  const author = authorUser
    ? {
        id: authorUser.id,
        full_name: authorUser.full_name,
        username: authorUser.username,
        avatar_url: authorUser.avatar_url,
      }
    : undefined;

  return {
    ...article,
    category,
    tags,
    author,
  };
}

export async function getArticles(options?: {
  status?: 'published' | 'draft' | 'scheduled';
  categoryId?: number;
  tagSlug?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: ArticleWithRelations[]; total: number }> {
  const db = getDb();
  let filtered = [...db.articles];

  if (options?.status) {
    filtered = filtered.filter(a => a.status === options.status);
  }

  if (options?.categoryId) {
    filtered = filtered.filter(a => a.category_id === options.categoryId);
  }

  if (options?.tagSlug) {
    const tag = db.tags.find(t => t.slug === options.tagSlug);
    if (tag) {
      const articleIds = db.article_tags.filter(at => at.tag_id === tag.id).map(at => at.article_id);
      filtered = filtered.filter(a => articleIds.includes(a.id));
    } else {
      filtered = [];
    }
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
    );
  }

  // Sort by published_at / created_at desc
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = filtered.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || total;
  const sliced = filtered.slice(offset, offset + limit);

  return {
    articles: sliced.map(a => populateArticle(a, db)),
    total,
  };
}

export async function getArticleBySlug(slug: string, onlyPublished = true): Promise<ArticleWithRelations | null> {
  const db = getDb();
  const article = db.articles.find(a => a.slug === slug && (!onlyPublished || a.status === 'published'));
  if (!article) return null;
  return populateArticle(article, db);
}

export async function getArticleById(id: number): Promise<ArticleWithRelations | null> {
  const db = getDb();
  const article = db.articles.find(a => a.id === id);
  if (!article) return null;
  return populateArticle(article, db);
}

export async function getRelatedArticles(articleId: number, categoryId: number, limit = 3): Promise<ArticleWithRelations[]> {
  const db = getDb();
  const related = db.articles
    .filter(a => a.id !== articleId && a.category_id === categoryId && a.status === 'published')
    .slice(0, limit);

  // If not enough in same category, backfill with recent published
  if (related.length < limit) {
    const extras = db.articles
      .filter(a => a.id !== articleId && a.status === 'published' && !related.some(r => r.id === a.id))
      .slice(0, limit - related.length);
    related.push(...extras);
  }

  return related.map(a => populateArticle(a, db));
}

export async function incrementArticleViews(id: number): Promise<void> {
  const db = getDb();
  const article = db.articles.find(a => a.id === id);
  if (article) {
    article.views = (article.views || 0) + 1;
    saveDb(db);
  }
}

export async function createArticle(data: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views'> & { tag_ids?: number[] }): Promise<ArticleWithRelations> {
  const db = getDb();
  const now = new Date().toISOString();
  const nextId = db.articles.length > 0 ? Math.max(...db.articles.map(a => a.id)) + 1 : 1;

  const newArticle: Article = {
    ...data,
    id: nextId,
    views: 0,
    created_at: now,
    updated_at: now,
  };

  db.articles.unshift(newArticle);

  if (data.tag_ids && data.tag_ids.length > 0) {
    let nextAtId = db.article_tags.length > 0 ? Math.max(...db.article_tags.map(at => at.id)) + 1 : 1;
    for (const tagId of data.tag_ids) {
      db.article_tags.push({
        id: nextAtId++,
        article_id: nextId,
        tag_id: tagId,
      });
    }
  }

  saveDb(db);
  return populateArticle(newArticle, db);
}

export async function updateArticle(id: number, data: Partial<Article> & { tag_ids?: number[] }): Promise<ArticleWithRelations | null> {
  const db = getDb();
  const index = db.articles.findIndex(a => a.id === id);
  if (index === -1) return null;

  db.articles[index] = {
    ...db.articles[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  if (data.tag_ids !== undefined) {
    // Remove existing relations
    db.article_tags = db.article_tags.filter(at => at.article_id !== id);
    let nextAtId = db.article_tags.length > 0 ? Math.max(...db.article_tags.map(at => at.id)) + 1 : 1;
    for (const tagId of data.tag_ids) {
      db.article_tags.push({
        id: nextAtId++,
        article_id: id,
        tag_id: tagId,
      });
    }
  }

  saveDb(db);
  return populateArticle(db.articles[index], db);
}

export async function deleteArticle(id: number): Promise<boolean> {
  const db = getDb();
  const initialLength = db.articles.length;
  db.articles = db.articles.filter(a => a.id !== id);
  db.article_tags = db.article_tags.filter(at => at.article_id !== id);
  if (db.articles.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- CATEGORIES -----------------
export async function getCategories(): Promise<(Category & { article_count: number })[]> {
  const db = getDb();
  return db.categories.map(c => ({
    ...c,
    article_count: db.articles.filter(a => a.category_id === c.id && a.status === 'published').length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = getDb();
  return db.categories.find(c => c.slug === slug) || null;
}

export async function createCategory(data: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const db = getDb();
  const nextId = db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1;
  const newCat: Category = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  db.categories.push(newCat);
  saveDb(db);
  return newCat;
}

export async function updateCategory(id: number, data: Partial<Category>): Promise<Category | null> {
  const db = getDb();
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...data };
  saveDb(db);
  return db.categories[index];
}

export async function deleteCategory(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.categories.length;
  db.categories = db.categories.filter(c => c.id !== id);
  if (db.categories.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- TAGS -----------------
export async function getTags(): Promise<(Tag & { article_count: number })[]> {
  const db = getDb();
  return db.tags.map(t => ({
    ...t,
    article_count: db.article_tags.filter(at => at.tag_id === t.id).length,
  }));
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const db = getDb();
  return db.tags.find(t => t.slug === slug) || null;
}

export async function createTag(data: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> {
  const db = getDb();
  const nextId = db.tags.length > 0 ? Math.max(...db.tags.map(t => t.id)) + 1 : 1;
  const newTag: Tag = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  db.tags.push(newTag);
  saveDb(db);
  return newTag;
}

export async function updateTag(id: number, data: Partial<Tag>): Promise<Tag | null> {
  const db = getDb();
  const index = db.tags.findIndex(t => t.id === id);
  if (index === -1) return null;
  db.tags[index] = { ...db.tags[index], ...data };
  saveDb(db);
  return db.tags[index];
}

export async function deleteTag(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.tags.length;
  db.tags = db.tags.filter(t => t.id !== id);
  db.article_tags = db.article_tags.filter(at => at.tag_id !== id);
  if (db.tags.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- PORTFOLIO -----------------
export async function getPortfolioList(): Promise<Portfolio[]> {
  const db = getDb();
  return [...db.portfolio].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  const db = getDb();
  return db.portfolio.find(p => p.slug === slug) || null;
}

export async function createPortfolio(data: Omit<Portfolio, 'id' | 'created_at'>): Promise<Portfolio> {
  const db = getDb();
  const nextId = db.portfolio.length > 0 ? Math.max(...db.portfolio.map(p => p.id)) + 1 : 1;
  const newPort: Portfolio = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  db.portfolio.unshift(newPort);
  saveDb(db);
  return newPort;
}

export async function updatePortfolio(id: number, data: Partial<Portfolio>): Promise<Portfolio | null> {
  const db = getDb();
  const index = db.portfolio.findIndex(p => p.id === id);
  if (index === -1) return null;
  db.portfolio[index] = { ...db.portfolio[index], ...data };
  saveDb(db);
  return db.portfolio[index];
}

export async function deletePortfolio(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.portfolio.length;
  db.portfolio = db.portfolio.filter(p => p.id !== id);
  if (db.portfolio.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- TESTIMONIALS -----------------
export async function getTestimonials(): Promise<Testimonial[]> {
  const db = getDb();
  return [...db.testimonials].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
  const db = getDb();
  const nextId = db.testimonials.length > 0 ? Math.max(...db.testimonials.map(t => t.id)) + 1 : 1;
  const newTest: Testimonial = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  db.testimonials.unshift(newTest);
  saveDb(db);
  return newTest;
}

export async function updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial | null> {
  const db = getDb();
  const index = db.testimonials.findIndex(t => t.id === id);
  if (index === -1) return null;
  db.testimonials[index] = { ...db.testimonials[index], ...data };
  saveDb(db);
  return db.testimonials[index];
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.testimonials.length;
  db.testimonials = db.testimonials.filter(t => t.id !== id);
  if (db.testimonials.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- PRICING PLANS -----------------
export async function getPricingPlans(): Promise<PricingPlan[]> {
  const db = getDb();
  return [...db.pricing_plans].sort((a, b) => a.price_numeric - b.price_numeric);
}

export async function createPricingPlan(data: Omit<PricingPlan, 'id' | 'created_at'>): Promise<PricingPlan> {
  const db = getDb();
  const nextId = db.pricing_plans.length > 0 ? Math.max(...db.pricing_plans.map(p => p.id)) + 1 : 1;
  const newPlan: PricingPlan = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  db.pricing_plans.push(newPlan);
  saveDb(db);
  return newPlan;
}

export async function updatePricingPlan(id: number, data: Partial<PricingPlan>): Promise<PricingPlan | null> {
  const db = getDb();
  const index = db.pricing_plans.findIndex(p => p.id === id);
  if (index === -1) return null;
  db.pricing_plans[index] = { ...db.pricing_plans[index], ...data };
  saveDb(db);
  return db.pricing_plans[index];
}

export async function deletePricingPlan(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.pricing_plans.length;
  db.pricing_plans = db.pricing_plans.filter(p => p.id !== id);
  if (db.pricing_plans.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- FAQS -----------------
export async function getFaqs(): Promise<FAQ[]> {
  const db = getDb();
  return [...db.faqs].sort((a, b) => a.order_index - b.order_index);
}

export async function createFaq(data: Omit<FAQ, 'id' | 'created_at'>): Promise<FAQ> {
  const db = getDb();
  const nextId = db.faqs.length > 0 ? Math.max(...db.faqs.map(f => f.id)) + 1 : 1;
  const newFaq: FAQ = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  db.faqs.push(newFaq);
  saveDb(db);
  return newFaq;
}

export async function updateFaq(id: number, data: Partial<FAQ>): Promise<FAQ | null> {
  const db = getDb();
  const index = db.faqs.findIndex(f => f.id === id);
  if (index === -1) return null;
  db.faqs[index] = { ...db.faqs[index], ...data };
  saveDb(db);
  return db.faqs[index];
}

export async function deleteFaq(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.faqs.length;
  db.faqs = db.faqs.filter(f => f.id !== id);
  if (db.faqs.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- MEDIA LIBRARY -----------------
export async function getMediaList(): Promise<Media[]> {
  const db = getDb();
  return [...db.media].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function addMedia(data: Omit<Media, 'id' | 'created_at'>): Promise<Media> {
  const db = getDb();
  const nextId = db.media.length > 0 ? Math.max(...db.media.map(m => m.id)) + 1 : 1;
  const newMedia: Media = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  db.media.unshift(newMedia);
  saveDb(db);
  return newMedia;
}

export async function deleteMedia(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.media.length;
  db.media = db.media.filter(m => m.id !== id);
  if (db.media.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- PAGES -----------------
export async function getPages(): Promise<Page[]> {
  const db = getDb();
  return [...db.pages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const db = getDb();
  return db.pages.find(p => p.slug === slug) || null;
}

export async function createPage(data: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<Page> {
  const db = getDb();
  const now = new Date().toISOString();
  const nextId = db.pages.length > 0 ? Math.max(...db.pages.map(p => p.id)) + 1 : 1;
  const newPage: Page = {
    ...data,
    id: nextId,
    created_at: now,
    updated_at: now,
  };
  db.pages.unshift(newPage);
  saveDb(db);
  return newPage;
}

export async function updatePage(id: number, data: Partial<Page>): Promise<Page | null> {
  const db = getDb();
  const index = db.pages.findIndex(p => p.id === id);
  if (index === -1) return null;
  db.pages[index] = {
    ...db.pages[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  saveDb(db);
  return db.pages[index];
}

export async function deletePage(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.pages.length;
  db.pages = db.pages.filter(p => p.id !== id);
  if (db.pages.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- SETTINGS -----------------
export async function getSettings(): Promise<Record<string, string>> {
  const db = getDb();
  return { ...db.settings };
}

export async function updateSettings(newSettings: Record<string, string>): Promise<Record<string, string>> {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...newSettings,
  };
  saveDb(db);
  return db.settings;
}

// ----------------- INQUIRIES / CONTACT LEADS -----------------
export async function getInquiries(): Promise<Inquiry[]> {
  const db = getDb();
  return [...db.inquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createInquiry(data: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<Inquiry> {
  const db = getDb();
  const nextId = db.inquiries.length > 0 ? Math.max(...db.inquiries.map(i => i.id)) + 1 : 1;
  const newInq: Inquiry = {
    ...data,
    id: nextId,
    status: 'unread',
    created_at: new Date().toISOString(),
  };
  db.inquiries.unshift(newInq);
  saveDb(db);
  return newInq;
}

export async function updateInquiryStatus(id: number, status: 'unread' | 'read' | 'contacted'): Promise<Inquiry | null> {
  const db = getDb();
  const inq = db.inquiries.find(i => i.id === id);
  if (!inq) return null;
  inq.status = status;
  saveDb(db);
  return inq;
}

export async function deleteInquiry(id: number): Promise<boolean> {
  const db = getDb();
  const initial = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => i.id !== id);
  if (db.inquiries.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- TRAFFIC LOGGING & ANALYTICS -----------------
export async function logTraffic(data: Omit<TrafficLog, 'id' | 'timestamp'>): Promise<void> {
  const db = getDb();
  const nextId = db.traffic_logs.length > 0 ? Math.max(...db.traffic_logs.map(t => t.id)) + 1 : 1;
  const entry: TrafficLog = {
    ...data,
    id: nextId,
    timestamp: new Date().toISOString(),
  };
  db.traffic_logs.push(entry);

  // Keep last 5000 logs to prevent file bloat
  if (db.traffic_logs.length > 5000) {
    db.traffic_logs = db.traffic_logs.slice(db.traffic_logs.length - 5000);
  }
  saveDb(db);
}

export async function getTrafficStats() {
  const db = getDb();
  const logs = db.traffic_logs;

  const totalPageviews = logs.length;
  const uniqueVisitors = new Set(logs.map(l => l.ip_hash)).size;

  // Device stats
  const deviceCounts = {
    desktop: logs.filter(l => l.device === 'desktop').length,
    mobile: logs.filter(l => l.device === 'mobile').length,
    tablet: logs.filter(l => l.device === 'tablet').length,
  };

  // Top visited pages
  const pageMap: Record<string, number> = {};
  logs.forEach(l => {
    pageMap[l.path] = (pageMap[l.path] || 0) + 1;
  });
  const topPages = Object.entries(pageMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Last 7 days breakdown
  const dailyStats: { date: string; views: number; visitors: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const dayLogs = logs.filter(l => l.timestamp.startsWith(dateStr));
    const dayVisitors = new Set(dayLogs.map(l => l.ip_hash)).size;

    dailyStats.push({
      date: dateStr,
      views: dayLogs.length,
      visitors: dayVisitors,
    });
  }

  return {
    totalPageviews,
    uniqueVisitors,
    deviceCounts,
    topPages,
    dailyStats,
  };
}

// ----------------- CITIES & KOTA LAYANAN -----------------
export async function getCities(): Promise<CityLanding[]> {
  const db = getDb();
  if (!db.cities) {
    db.cities = getInitialCities();
    saveDb(db);
  }
  return [...db.cities].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getCityBySlug(slug: string): Promise<CityLanding | null> {
  const db = getDb();
  if (!db.cities) {
    db.cities = getInitialCities();
    saveDb(db);
  }
  const cleanSlug = slug.toLowerCase().trim();
  return db.cities.find(c => c.slug.toLowerCase() === cleanSlug) || null;
}

export async function getCityById(id: number): Promise<CityLanding | null> {
  const db = getDb();
  if (!db.cities) {
    db.cities = getInitialCities();
    saveDb(db);
  }
  return db.cities.find(c => c.id === id) || null;
}

export async function createCity(data: Omit<CityLanding, 'id' | 'created_at' | 'updated_at'>): Promise<CityLanding> {
  const db = getDb();
  if (!db.cities) {
    db.cities = getInitialCities();
  }
  const now = new Date().toISOString();
  const nextId = db.cities.length > 0 ? Math.max(...db.cities.map(c => c.id)) + 1 : 1;
  const newCity: CityLanding = {
    ...data,
    id: nextId,
    created_at: now,
    updated_at: now,
  };
  db.cities.unshift(newCity);
  saveDb(db);
  return newCity;
}

export async function updateCity(id: number, data: Partial<CityLanding>): Promise<CityLanding | null> {
  const db = getDb();
  if (!db.cities) {
    db.cities = getInitialCities();
  }
  const index = db.cities.findIndex(c => c.id === id);
  if (index === -1) return null;
  db.cities[index] = {
    ...db.cities[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  saveDb(db);
  return db.cities[index];
}

export async function deleteCity(id: number): Promise<boolean> {
  const db = getDb();
  if (!db.cities) {
    db.cities = getInitialCities();
  }
  const initial = db.cities.length;
  db.cities = db.cities.filter(c => c.id !== id);
  if (db.cities.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}
