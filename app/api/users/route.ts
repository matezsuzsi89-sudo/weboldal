import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { getAllUsers, addUser } from '@/lib/users';
import type { UserRole } from '@/lib/users';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await getAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Felhasználók betöltése sikertelen.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuth(request);
  if (!auth.ok || !auth.isAdmin) {
    return NextResponse.json({ error: 'Csak admin adhat hozzá felhasználót.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, password, role, name } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'E-mail cím megadása kötelező.' },
        { status: 400 }
      );
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'A jelszónak legalább 6 karakter hosszúnak kell lennie.' },
        { status: 400 }
      );
    }

    const userRole: UserRole = role === 'admin' ? 'admin' : 'user';
    const user = await addUser(
      email.trim(),
      password,
      userRole,
      typeof name === 'string' ? name : ''
    );
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Hiba történt';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
