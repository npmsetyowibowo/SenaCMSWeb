import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { updateUser, getUserById } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { full_name, email, current_password, new_password, avatar_url } = body;

    const dbUser = await getUserById(user.id);
    if (!dbUser) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });

    const updateData: any = {};
    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email;
    if (avatar_url) updateData.avatar_url = avatar_url;

    // Password change request
    if (new_password) {
      if (!current_password) {
        return NextResponse.json({ error: 'Password saat ini wajib diisi untuk mengubah password baru' }, { status: 400 });
      }

      const isCurrentValid = verifyPassword(current_password, dbUser.password_hash);
      if (!isCurrentValid) {
        return NextResponse.json({ error: 'Password saat ini salah' }, { status: 400 });
      }

      if (new_password.length < 5) {
        return NextResponse.json({ error: 'Password baru minimal 5 karakter' }, { status: 400 });
      }

      updateData.password_hash = hashPassword(new_password);
    }

    const updated = await updateUser(user.id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Profil dan kredensial berhasil diperbarui',
      user: {
        id: updated?.id,
        username: updated?.username,
        email: updated?.email,
        full_name: updated?.full_name,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
