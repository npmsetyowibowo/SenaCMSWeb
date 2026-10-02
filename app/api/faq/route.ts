import { NextRequest, NextResponse } from 'next/server';
import { getFaqs, createFaq } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getFaqs();
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
    const { question, answer, category, order_index } = body;
    if (!question || !answer) {
      return NextResponse.json({ error: 'Pertanyaan dan jawaban FAQ wajib diisi' }, { status: 400 });
    }

    const faq = await createFaq({
      question,
      answer,
      category: category || 'Umum',
      order_index: order_index ? parseInt(order_index, 10) : 0,
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
