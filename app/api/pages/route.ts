import { NextRequest, NextResponse } from 'next/server';
import { getPages, createPage } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getPages();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, slug, content, excerpt, status, seo_title, seo_description } = body;
    if (!title || !content) {
      return NextResponse.json({ error: 'Judul dan konten halaman wajib diisi' }, { status: 400 });
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newPage = await createPage({
      title,
      slug: generatedSlug,
      content,
      excerpt: excerpt || '',
      status: status || 'published',
      seo_title: seo_title || title,
      seo_description: seo_description || excerpt || '',
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
