import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getCategories();
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
    const { name, slug, description, color } = body;
    if (!name) return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 });

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const cat = await createCategory({
      name,
      slug: generatedSlug,
      description: description || '',
      color: color || '#2563eb',
    });

    return NextResponse.json(cat, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
