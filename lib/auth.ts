import { NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/users';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '1234';

export type AuthResult =
  | { ok: true; isAdmin: true }
  | { ok: true; isAdmin: false; user: { id: string; email: string; role: string; name: string } }
  | { ok: false };

export async function getAuth(request: NextRequest): Promise<AuthResult> {
  const secret = request.nextUrl.searchParams.get('secret') ?? request.headers.get('x-admin-secret');
  if (!secret) return { ok: false };

  if (secret === ADMIN_SECRET) {
    return { ok: true, isAdmin: true };
  }

  const user = await getSessionUser(secret);
  if (!user) return { ok: false };

  return {
    ok: true,
    isAdmin: user.role === 'admin',
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  };
}

export function requireAdmin(auth: AuthResult): boolean {
  return auth.ok && auth.isAdmin;
}

export async function isAuthorized(request: NextRequest): Promise<boolean> {
  const auth = await getAuth(request);
  return auth.ok;
}
