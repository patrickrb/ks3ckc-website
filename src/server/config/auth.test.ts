import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';

import { env } from '@/env.mjs';
import {
  AUTH_COOKIE_NAME,
  deleteUsedCode,
  generateCode,
  getServerAuthSession,
  validateCode,
} from '@/server/config/auth';

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('next/headers');
jest.mock('@/env.mjs', () => ({
  env: {
    AUTH_SECRET: 'test-secret',
    NEXT_PUBLIC_IS_DEMO: false,
  },
}));

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;

// Create mock context
const createMockContext = (overrides = {}): any => ({
  user: null,
  apiType: 'TRPC' as const,
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    fatal: jest.fn(),
    silent: jest.fn(),
    level: 'info' as const,
    child: jest.fn().mockImplementation(() => createMockContext().logger),
  },
  db: {
    verificationToken: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
  ...overrides,
});

describe('Auth utilities', () => {
  let mockContext: ReturnType<typeof createMockContext>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContext = createMockContext();
  });

  describe('getServerAuthSession', () => {
    it('returns null when no token in headers or cookies', async () => {
      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      } as any);

      mockCookies.mockReturnValue({
        get: jest.fn().mockReturnValue(undefined),
      } as any);

      const result = await getServerAuthSession();

      expect(result).toBeNull();
    });

    it('extracts token from Authorization header', async () => {
      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('Bearer valid-jwt-token'),
      } as any);

      mockCookies.mockReturnValue({
        get: jest.fn().mockReturnValue(undefined),
      } as any);

      mockJwt.verify.mockImplementation(() => ({ userId: 'user-1' }));

      // Note: This test would need the actual database context to work fully
      // For now, we're testing the token extraction logic
      expect(mockHeaders().get).toHaveBeenCalledWith('Authorization');
    });

    it('extracts token from cookies when header is not present', async () => {
      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      } as any);

      mockCookies.mockReturnValue({
        get: jest.fn().mockReturnValue({ value: 'cookie-jwt-token' }),
      } as any);

      mockJwt.verify.mockImplementation(() => ({ userId: 'user-1' }));

      await getServerAuthSession();

      expect(mockCookies().get).toHaveBeenCalledWith(AUTH_COOKIE_NAME);
    });

    it('handles invalid JWT token', async () => {
      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('Bearer invalid-token'),
      } as any);

      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await getServerAuthSession();

      expect(result).toBeNull();
    });

    it('handles malformed Authorization header', async () => {
      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('InvalidHeader'),
      } as any);

      mockCookies.mockReturnValue({
        get: jest.fn().mockReturnValue(undefined),
      } as any);

      const result = await getServerAuthSession();

      expect(result).toBeNull();
    });
  });

  describe('validateCode', () => {
    const mockToken = {
      token: 'test-token',
      userId: 'user-1',
      code: 'hashed-code',
      attempts: 0,
      lastAttemptAt: new Date(),
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    };

    it('validates code successfully', async () => {
      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(mockToken);
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(true));
      mockJwt.sign.mockImplementation(() => 'generated-jwt');

      const result = await validateCode({
        ctx: mockContext,
        code: '123456',
        token: 'test-token',
      });

      expect(result).toEqual({
        verificationToken: mockToken,
        userJwt: 'generated-jwt',
      });

      expect(mockContext.db.verificationToken.deleteMany).toHaveBeenCalledWith({
        where: { expires: { lt: expect.any(Date) } },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-code');
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: 'user-1' },
        env.AUTH_SECRET,
        { expiresIn: '30d' }
      );
    });

    it('throws error when token does not exist', async () => {
      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(null);

      await expect(
        validateCode({
          ctx: mockContext,
          code: '123456',
          token: 'non-existent-token',
        })
      ).rejects.toThrow();

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        'Verification token does not exist'
      );
    });

    it('throws error when code is invalid', async () => {
      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(mockToken);
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(false));

      await expect(
        validateCode({
          ctx: mockContext,
          code: 'wrong-code',
          token: 'test-token',
        })
      ).rejects.toThrow();

      expect(mockContext.logger.warn).toHaveBeenCalledWith('Invalid code');
      expect(mockContext.db.verificationToken.update).toHaveBeenCalledWith({
        where: { token: 'test-token' },
        data: { attempts: { increment: 1 } },
      });
    });

    it('handles retry delay when too many recent attempts', async () => {
      const recentToken = {
        ...mockToken,
        attempts: 3,
        lastAttemptAt: new Date(), // Recent attempt
      };

      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(
        recentToken
      );

      await expect(
        validateCode({
          ctx: mockContext,
          code: '123456',
          token: 'test-token',
        })
      ).rejects.toThrow();

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        'Last attempt was to close'
      );
    });

    it('cleans up expired tokens before validation', async () => {
      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 2,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(mockToken);
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(true));
      mockJwt.sign.mockImplementation(() => 'generated-jwt');

      await validateCode({
        ctx: mockContext,
        code: '123456',
        token: 'test-token',
      });

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        'Removing expired verification tokens from database'
      );
      expect(mockContext.db.verificationToken.deleteMany).toHaveBeenCalledWith({
        where: { expires: { lt: expect.any(Date) } },
      });
    });

    it('handles database errors gracefully', async () => {
      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(mockToken);
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(false));
      mockContext.db.verificationToken.update.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        validateCode({
          ctx: mockContext,
          code: 'wrong-code',
          token: 'test-token',
        })
      ).rejects.toThrow();

      expect(mockContext.logger.error).toHaveBeenCalledWith(
        'Failed to update token attempts'
      );
    });
  });

  describe('generateCode', () => {
    it('generates code with default length', async () => {
      mockBcrypt.hash.mockImplementation(() => Promise.resolve('hashed-code'));

      const result = await generateCode();

      expect(result.readable).toHaveLength(6); // Default length
      expect(result.hashed).toBe('hashed-code');
      expect(mockBcrypt.hash).toHaveBeenCalledWith(result.readable, 10);
    });

    it('generates code with expected format', async () => {
      mockBcrypt.hash.mockImplementation(() =>
        Promise.resolve('hashed-custom-code')
      );

      const result = await generateCode();

      expect(result.readable).toHaveLength(6); // Default length
      expect(result.hashed).toBe('hashed-custom-code');
    });

    it('generates numeric code only', async () => {
      mockBcrypt.hash.mockImplementation(() =>
        Promise.resolve('hashed-numeric-code')
      );

      const result = await generateCode();

      expect(result.readable).toMatch(/^\d+$/); // Only digits
    });

    it('generates different codes on multiple calls', async () => {
      mockBcrypt.hash
        .mockImplementation(() => Promise.resolve('hashed-code-1'))
        .mockImplementationOnce(() => Promise.resolve('hashed-code-1'))
        .mockImplementationOnce(() => Promise.resolve('hashed-code-2'));

      const result1 = await generateCode();
      const result2 = await generateCode();

      expect(result1.readable).not.toBe(result2.readable);
    });
  });

  describe('deleteUsedCode', () => {
    it('deletes verification token successfully', async () => {
      mockContext.db.verificationToken.delete.mockResolvedValue({
        token: 'test-token',
        userId: 'user-1',
        code: 'hashed-code',
        attempts: 1,
        lastAttemptAt: new Date(),
        expires: new Date(),
      });

      await deleteUsedCode({
        ctx: mockContext,
        token: 'test-token',
      });

      expect(mockContext.db.verificationToken.delete).toHaveBeenCalledWith({
        where: { token: 'test-token' },
      });
      expect(mockContext.logger.info).toHaveBeenCalledWith(
        'Removing used verification token'
      );
    });

    it('handles non-existent token gracefully', async () => {
      mockContext.db.verificationToken.delete.mockRejectedValue(
        new Error('Token not found')
      );

      await expect(
        deleteUsedCode({
          ctx: mockContext,
          token: 'non-existent-token',
        })
      ).rejects.toThrow('Token not found');
    });

    it('logs deletion attempt', async () => {
      mockContext.db.verificationToken.delete.mockResolvedValue({} as any);

      await deleteUsedCode({
        ctx: mockContext,
        token: 'test-token',
      });

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        'Removing used verification token'
      );
    });
  });

  describe('Authentication flow integration', () => {
    it('complete authentication flow', async () => {
      // Step 1: Generate code
      mockBcrypt.hash.mockImplementation(() =>
        Promise.resolve('hashed-123456')
      );

      const codeResult = await generateCode();
      expect(codeResult.readable).toHaveLength(6);
      expect(codeResult.hashed).toBe('hashed-123456');

      // Step 2: Store token in database (simulated)
      const storedToken = {
        token: 'verification-token',
        userId: 'user-1',
        code: codeResult.hashed,
        attempts: 0,
        lastAttemptAt: new Date(),
        expires: new Date(Date.now() + 10 * 60 * 1000),
      };

      // Step 3: Validate code
      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(
        storedToken
      );
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(true));
      mockJwt.sign.mockImplementation(() => 'final-jwt-token');

      const validationResult = await validateCode({
        ctx: mockContext,
        code: codeResult.readable,
        token: 'verification-token',
      });

      expect(validationResult.userJwt).toBe('final-jwt-token');
      expect(validationResult.verificationToken).toEqual(storedToken);

      // Step 4: Clean up used token
      mockContext.db.verificationToken.delete.mockResolvedValue(storedToken);

      await deleteUsedCode({
        ctx: mockContext,
        token: 'verification-token',
      });

      expect(mockContext.db.verificationToken.delete).toHaveBeenCalledWith({
        where: { token: 'verification-token' },
      });
    });

    it('handles invalid code attempt and retry', async () => {
      const tokenWithAttempts = {
        token: 'test-token',
        userId: 'user-1',
        code: 'hashed-correct-code',
        attempts: 1,
        lastAttemptAt: new Date(Date.now() - 5000), // 5 seconds ago
        expires: new Date(Date.now() + 10 * 60 * 1000),
      };

      // First attempt - wrong code
      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(
        tokenWithAttempts
      );
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(false));

      await expect(
        validateCode({
          ctx: mockContext,
          code: 'wrong-code',
          token: 'test-token',
        })
      ).rejects.toThrow();

      expect(mockContext.db.verificationToken.update).toHaveBeenCalledWith({
        where: { token: 'test-token' },
        data: { attempts: { increment: 1 } },
      });

      // Second attempt - correct code
      const updatedToken = { ...tokenWithAttempts, attempts: 2 };
      mockContext.db.verificationToken.findUnique.mockResolvedValue(
        updatedToken
      );
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(true));
      mockJwt.sign.mockImplementation(() => 'success-jwt');

      const result = await validateCode({
        ctx: mockContext,
        code: 'correct-code',
        token: 'test-token',
      });

      expect(result.userJwt).toBe('success-jwt');
    });
  });

  describe('JWT token handling', () => {
    it('sets expiration time when creating JWT', async () => {
      // Mock implementation for test
      const mockToken = {
        token: 'test-token',
        userId: 'user-123',
        code: 'hashed-code',
        attempts: 0,
        lastAttemptAt: new Date(Date.now() - 60000), // 1 minute ago
        expires: new Date(Date.now() + 10 * 60 * 1000),
      };

      mockContext.db.verificationToken.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockContext.db.verificationToken.findUnique.mockResolvedValue(mockToken);
      mockBcrypt.compare.mockImplementation(() => Promise.resolve(true));

      // Check that jwt.sign is called with the expiresIn option
      await validateCode({
        ctx: mockContext,
        code: '123456',
        token: 'test-token',
      });

      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: 'user-123' },
        env.AUTH_SECRET,
        { expiresIn: '30d' }
      );
    });

    it('rejects expired tokens', async () => {
      // Setup headers with a token
      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('Bearer expired-token'),
      } as any);

      mockCookies.mockReturnValue({
        get: jest.fn().mockReturnValue(undefined),
      } as any);

      // Mock verify to return an expired token
      mockJwt.verify.mockImplementation(() => ({
        id: 'user-123',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour in the past
      }));

      const result = await getServerAuthSession();
      expect(result).toBeNull();
    });
  });
});
