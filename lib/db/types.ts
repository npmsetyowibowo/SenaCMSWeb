export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'admin' | 'editor';
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  token: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color?: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  status: 'draft' | 'published' | 'scheduled';
  category_id: number;
  author_id: number;
  focus_keyword: string;
  seo_title: string;
  seo_description: string;
  seo_score: number;
  reading_time: number;
  views: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleTag {
  id: number;
  article_id: number;
  tag_id: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  template?: string;
  status: 'draft' | 'published';
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: number;
  title: string;
  slug: string;
  category: string;
  client: string;
  thumbnail: string;
  url: string;
  description: string;
  tech_stack: string[];
  is_featured: boolean;
  created_at: string;
}

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  alt_text: string;
  width?: number;
  height?: number;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
  group: 'general' | 'seo' | 'appearance' | 'contact' | 'social' | 'navigation';
  updated_at: string;
}

export interface SeoMetadata {
  id: number;
  page_path: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_image: string;
  structured_data: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number; // 1-5
  is_featured: boolean;
  created_at: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  price_numeric: number;
  period: string;
  description: string;
  features: string[];
  is_popular: boolean;
  cta_text: string;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  created_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  status: 'unread' | 'read' | 'contacted';
  created_at: string;
}

export interface TrafficLog {
  id: number;
  path: string;
  ip_hash: string;
  user_agent: string;
  device: 'desktop' | 'mobile' | 'tablet';
  referrer: string;
  timestamp: string;
}

export interface CityFaq {
  id?: number;
  question: string;
  answer: string;
}

export interface CityLanding {
  id: number;
  city_name: string;
  province_name: string;
  slug: string;
  hero_title: string;
  hero_subtitle: string;
  badge_text: string; // Bubble kecil / judul kecil
  local_keywords: string[];
  faqs: CityFaq[]; // editable FAQ khusus kota layanan
  meta_title?: string;
  meta_description?: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  categories: Category[];
  tags: Tag[];
  articles: Article[];
  article_tags: ArticleTag[];
  pages: Page[];
  portfolio: Portfolio[];
  media: Media[];
  settings: Record<string, string>;
  seo_metadata: SeoMetadata[];
  testimonials: Testimonial[];
  pricing_plans: PricingPlan[];
  faqs: FAQ[];
  inquiries: Inquiry[];
  traffic_logs: TrafficLog[];
  cities?: CityLanding[];
}
