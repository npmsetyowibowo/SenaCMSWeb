import { NextRequest, NextResponse } from 'next/server';
import { getTags, createTag } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getTags();
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
    const { name, slug } = body;
    if (!name) return NextResponse.json({ error: 'Nama tag wajib diisi' }, { status: 400 });

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newTag = await createTag({
      name,
      slug: generatedSlug,
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
