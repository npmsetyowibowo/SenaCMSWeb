import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, createTestimonial } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getTestimonials();
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
    const { name, role, company, avatar, content, rating, is_featured } = body;
    if (!name || !content) {
      return NextResponse.json({ error: 'Nama dan ulasan testimonial wajib diisi' }, { status: 400 });
    }

    const test = await createTestimonial({
      name,
      role: role || 'Klien Puas',
      company: company || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      content,
      rating: rating ? parseInt(rating, 10) : 5,
      is_featured: is_featured !== undefined ? Boolean(is_featured) : true,
    });

    return NextResponse.json(test, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
