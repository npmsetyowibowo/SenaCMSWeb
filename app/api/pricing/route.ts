import { NextRequest, NextResponse } from 'next/server';
import { getPricingPlans, createPricingPlan } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getPricingPlans();
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
    const { name, price, price_numeric, period, description, features, is_popular, cta_text } = body;
    if (!name || !price) {
      return NextResponse.json({ error: 'Nama paket dan harga wajib diisi' }, { status: 400 });
    }

    const plan = await createPricingPlan({
      name,
      price,
      price_numeric: price_numeric ? parseInt(price_numeric, 10) : 0,
      period: period || 'Sekali Bayar',
      description: description || '',
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
      is_popular: Boolean(is_popular),
      cta_text: cta_text || 'Pilih Paket Ini',
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
