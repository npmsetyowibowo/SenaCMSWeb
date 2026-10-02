import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioList, createPortfolio } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getPortfolioList();
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
    const { title, slug, category, client, thumbnail, url, description, tech_stack, is_featured } = body;
    if (!title || !category) {
      return NextResponse.json({ error: 'Judul dan kategori portofolio wajib diisi' }, { status: 400 });
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const port = await createPortfolio({
      title,
      slug: generatedSlug,
      category,
      client: client || '',
      thumbnail: thumbnail || '',
      url: url || '',
      description: description || '',
      tech_stack: Array.isArray(tech_stack) ? tech_stack : (typeof tech_stack === 'string' ? tech_stack.split(',').map((s: string) => s.trim()) : []),
      is_featured: is_featured !== undefined ? Boolean(is_featured) : true,
    });

    return NextResponse.json(port, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
