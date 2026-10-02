import { NextRequest, NextResponse } from 'next/server';
import { deleteMedia } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const success = await deleteMedia(parseInt(id, 10));
    if (!success) return NextResponse.json({ error: 'Media tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Media berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
