import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { analyzeSeo } from '@/lib/seo-analyzer';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await getArticleById(parseInt(id, 10));
    if (!article) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, { status: 401 });
    }

    const { id } = await params;
    const articleId = parseInt(id, 10);
    const body = await req.json();

    const existing = await getArticleById(articleId);
    if (!existing) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    const title = body.title !== undefined ? body.title : existing.title;
    const content = body.content !== undefined ? body.content : existing.content;
    const slug = body.slug !== undefined ? body.slug : existing.slug;
    const focusKeyword = body.focus_keyword !== undefined ? body.focus_keyword : existing.focus_keyword;
    const seoTitle = body.seo_title !== undefined ? body.seo_title : existing.seo_title;
    const seoDesc = body.seo_description !== undefined ? body.seo_description : existing.seo_description;

    // Recalculate SEO score
    const seoResult = analyzeSeo({
      title,
      slug,
      content,
      seoTitle,
      seoDescription: seoDesc,
      focusKeyword,
    });

    const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const updated = await updateArticle(articleId, {
      ...body,
      seo_score: seoResult.score,
      reading_time: readingTime,
      published_at:
        body.status === 'published' && !existing.published_at
          ? new Date().toISOString()
          : existing.published_at,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteArticle(parseInt(id, 10));
    if (!success) {
      return NextResponse.json({ error: 'Gagal menghapus artikel' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
