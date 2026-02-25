import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, createSession } from '@/lib/users';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '1234';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Jelszó megadása kötelező.' },
        { status: 400 }
      );
    }

    // Először az admin jelszót engedjük be, akkor is, ha az e-mail mezőben véletlenül maradt bármi
    if (password === ADMIN_SECRET) {
      return NextResponse.json({
        token: ADMIN_SECRET,
        user: { role: 'admin', name: 'Admin' },
      });
    }

    const emailStr = typeof email === 'string' ? email.trim() : '';
    if (emailStr) {
      const user = await verifyUser(emailStr, password);
      if (!user) {
        return NextResponse.json(
          { error: 'Hibás e-mail vagy jelszó.' },
          { status: 401 }
        );
      }
      const token = await createSession(user.id);
      return NextResponse.json({
        token,
        user: { id: user.id, email: user.email, role: user.role, name: user.name },
      });
    }

    return NextResponse.json(
      { error: 'Hibás jelszó.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Belépési hiba.' },
      { status: 500 }
    );
  }
}
