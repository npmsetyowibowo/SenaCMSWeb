import { NextRequest, NextResponse } from 'next/server';
import { getCityById, updateCity, deleteCity } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const city = await getCityById(parseInt(id, 10));
    if (!city) return NextResponse.json({ error: 'Kota layanan tidak ditemukan' }, { status: 404 });
    return NextResponse.json(city);
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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    if (body.slug) {
      body.slug = body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (body.local_keywords && typeof body.local_keywords === 'string') {
      body.local_keywords = body.local_keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
    }

    const updated = await updateCity(parseInt(id, 10), body);
    if (!updated) return NextResponse.json({ error: 'Kota tidak ditemukan' }, { status: 404 });

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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const success = await deleteCity(parseInt(id, 10));
    if (!success) return NextResponse.json({ error: 'Gagal menghapus kota' }, { status: 400 });

    return NextResponse.json({ success: true, message: 'Kota layanan berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
