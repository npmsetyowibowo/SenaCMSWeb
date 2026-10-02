import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    const result = await loginUser(username, password);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.user?.id,
        username: result.user?.username,
        full_name: result.user?.full_name,
        role: result.user?.role,
        avatar_url: result.user?.avatar_url,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
