import { NextRequest, NextResponse } from 'next/server';
import { updatePortfolio, deletePortfolio } from '@/lib/db';
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
    if (body.tech_stack && typeof body.tech_stack === 'string') {
      body.tech_stack = body.tech_stack.split(',').map((s: string) => s.trim());
    }

    const updated = await updatePortfolio(parseInt(id, 10), body);
    if (!updated) return NextResponse.json({ error: 'Portofolio tidak ditemukan' }, { status: 404 });
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
    const success = await deletePortfolio(parseInt(id, 10));
    if (!success) return NextResponse.json({ error: 'Gagal menghapus' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
