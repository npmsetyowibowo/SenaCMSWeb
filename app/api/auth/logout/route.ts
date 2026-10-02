import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth';

export async function POST() {
  try {
    await logoutUser();
    return NextResponse.json({ success: true, message: 'Berhasil logout' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal logout' }, { status: 500 });
  }
}
