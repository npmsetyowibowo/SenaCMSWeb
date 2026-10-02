import { NextRequest, NextResponse } from 'next/server';
import { getInquiries, createInquiry } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const list = await getInquiries();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, budget, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Nama, email, nomor WhatsApp, dan pesan konsultasi wajib diisi' },
        { status: 400 }
      );
    }

    const inq = await createInquiry({
      name,
      email,
      phone,
      service: service || 'Company Profile',
      budget: budget || 'Rp1.800.000',
      message,
    });

    return NextResponse.json(inq, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
