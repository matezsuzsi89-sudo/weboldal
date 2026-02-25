import crypto from 'crypto';
import { prisma } from '@/lib/db';

export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  createdAt: string;
};

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'));
}

export async function getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
  const rows = await prisma.user.findMany({
    select: { id: true, email: true, role: true, name: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    role: r.role as UserRole,
    name: r.name,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const row = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  });
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role as UserRole,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function addUser(
  email: string,
  password: string,
  role: UserRole,
  name: string
): Promise<Omit<User, 'passwordHash'>> {
  const existing = await prisma.user.findFirst({
    where: { email: { equals: email.trim().toLowerCase(), mode: 'insensitive' } },
  });
  if (existing) {
    throw new Error('Ez az e-mail cím már regisztrálva van.');
  }
  const row = await prisma.user.create({
    data: {
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      role,
      name: name.trim() || email.split('@')[0],
    },
  });
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function verifyUser(email: string, password: string): Promise<Omit<User, 'passwordHash'> | null> {
  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.session.create({
    data: { token, userId },
  });
  return token;
}

export async function getSessionUser(token: string): Promise<Omit<User, 'passwordHash'> | null> {
  const sess = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!sess) return null;
  const u = sess.user;
  return {
    id: u.id,
    email: u.email,
    role: u.role as UserRole,
    name: u.name,
    createdAt: u.createdAt.toISOString(),
  };
}
