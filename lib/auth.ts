import { hash, compare } from 'bcryptjs';
import { db } from './db';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createUser(email: string, name: string, password: string) {
  const passwordHash = await hashPassword(password);
  return db.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
  });
}

export async function verifyUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  return user;
}




