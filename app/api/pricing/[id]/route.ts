import { NextRequest, NextResponse } from 'next/server';
import { updatePricingPlan, deletePricingPlan } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    if (body.price_numeric) body.price_numeric = parseInt(body.price_numeric, 10);
    if (body.features && typeof body.features === 'string') {
      body.features = body.features.split('\n').filter(Boolean);
    }

    const updated = await updatePricingPlan(parseInt(id, 10), body);
    if (!updated) return NextResponse.json({ error: 'Paket harga tidak ditemukan' }, { status: 404 });
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
    const success = await deletePricingPlan(parseInt(id, 10));
    if (!success) return NextResponse.json({ error: 'Gagal menghapus' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
