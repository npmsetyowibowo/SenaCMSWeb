import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createSession, deleteSession, getSessionByToken, getUserByUsername } from './db';
import { User } from './db/types';

export const SESSION_COOKIE_NAME = 'sena_session';

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    console.error('Password verify error:', error);
    return false;
  }
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function loginUser(username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  const user = await getUserByUsername(username);
  if (!user) {
    return { success: false, error: 'Username atau password tidak sesuai.' };
  }

  const isValid = verifyPassword(password, user.password_hash);
  if (!isValid) {
    return { success: false, error: 'Username atau password tidak sesuai.' };
  }

  const token = generateToken();
  await createSession(user.id, token);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // Ensure cookies work across all reverse proxies and previews
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return { success: true, user, token };
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSession(token);
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await getSessionByToken(token);
  return session ? session.user : null;
}
