import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { analyzeSeo } from '@/lib/seo-analyzer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as any;
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!, 10) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const res = await getArticles({
      status,
      search,
      categoryId,
      limit,
      offset,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      status,
      category_id,
      focus_keyword,
      seo_title,
      seo_description,
      tag_ids,
    } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Judul dan konten artikel wajib diisi' }, { status: 400 });
    }

    // Auto-generate clean slug if empty
    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Calculate SEO score
    const seoResult = analyzeSeo({
      title,
      slug: generatedSlug,
      content,
      seoTitle: seo_title || title,
      seoDescription: seo_description || excerpt || '',
      focusKeyword: focus_keyword || '',
    });

    // Calculate reading time
    const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const newArticle = await createArticle({
      title,
      slug: generatedSlug,
      excerpt: excerpt || '',
      content,
      thumbnail: thumbnail || '',
      status: status || 'draft',
      category_id: category_id ? parseInt(category_id, 10) : 1,
      author_id: user.id,
      focus_keyword: focus_keyword || '',
      seo_title: seo_title || title,
      seo_description: seo_description || excerpt || '',
      seo_score: seoResult.score,
      reading_time: readingTime,
      published_at: status === 'published' ? new Date().toISOString() : '',
      tag_ids: Array.isArray(tag_ids) ? tag_ids : [],
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (err: any) {
    console.error('Error creating article:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
