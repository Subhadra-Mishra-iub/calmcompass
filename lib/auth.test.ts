import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword, verifyPassword } from './auth';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  compare: vi.fn((password: string, hash: string) => Promise.resolve(hash === `hashed_${password}`)),
}));

describe('auth utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hashed = await hashPassword(password);
      expect(hashed).toBeTruthy();
      expect(hashed).not.toBe(password);
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'testpassword123';
      const hashed = `hashed_${password}`;
      const isValid = await verifyPassword(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hashed = `hashed_${password}`;
      const isValid = await verifyPassword(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });
  });
});


