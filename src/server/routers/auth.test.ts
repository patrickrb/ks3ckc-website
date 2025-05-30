import { cookies } from 'next/headers';
import { sendEmail } from '@/server/config/email';
import { validateCode } from '@/server/config/auth';
import { authRouter } from '@/server/routers/auth';

// Mock dependencies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/server/config/email', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('@/server/config/auth', () => ({
  validateCode: jest.fn(),
}));

jest.mock('@/emails/templates/login-code', () => {
  return jest.fn().mockImplementation(() => ({ type: 'login-code' }));
});

jest.mock('@/emails/templates/login-not-found', () => ({
  EmailLoginNotFound: jest.fn().mockImplementation(() => ({ type: 'login-not-found' })),
}));

jest.mock('@/emails/templates/register-code', () => {
  return jest.fn().mockImplementation(() => ({ type: 'register-code' }));
});

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('@/lib/i18n/server', () => ({
  default: {
    getServerInstance: jest.fn(),
  },
}));

// Mock the extended TRPC error
jest.mock('@/server/config/errors', () => ({
  ExtendedTRPCError: jest.fn().mockImplementation((args) => new Error(args.message || 'Extended TRPC Error')),
}));

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
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    verificationToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  ...overrides,
});

describe('authRouter', () => {
  let mockContext: ReturnType<typeof createMockContext>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContext = createMockContext();
  });

  describe('checkAuthenticated', () => {
    it('returns not authenticated when no user', async () => {
      const caller = authRouter.createCaller(mockContext);
      
      const result = await caller.checkAuthenticated();
      
      expect(result).toEqual({
        isAuthenticated: false,
        authorizations: undefined,
      });
      expect(mockContext.logger.info).toHaveBeenCalledWith('User is not logged');
    });

    it('returns authenticated when user exists', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        authorizations: ['USER'],
      };
      
      mockContext = createMockContext({ user: mockUser });
      const caller = authRouter.createCaller(mockContext);
      
      const result = await caller.checkAuthenticated();
      
      expect(result).toEqual({
        isAuthenticated: true,
        authorizations: ['USER'],
      });
      expect(mockContext.logger.info).toHaveBeenCalledWith('User is logged');
    });

    it('logs correctly for authenticated user', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        authorizations: ['USER', 'ADMIN'],
      };
      
      mockContext = createMockContext({ user: mockUser });
      const caller = authRouter.createCaller(mockContext);
      
      await caller.checkAuthenticated();
      
      expect(mockContext.logger.info).toHaveBeenCalledWith('User is logged');
    });

    it('handles user with empty authorizations', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        authorizations: [],
      };
      
      mockContext = createMockContext({ user: mockUser });
      const caller = authRouter.createCaller(mockContext);
      
      const result = await caller.checkAuthenticated();
      
      expect(result).toEqual({
        isAuthenticated: true,
        authorizations: [],
      });
    });

    it('handles user with null authorizations', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        authorizations: null,
      };
      
      mockContext = createMockContext({ user: mockUser });
      const caller = authRouter.createCaller(mockContext);
      
      const result = await caller.checkAuthenticated();
      
      expect(result).toEqual({
        isAuthenticated: true,
        authorizations: null,
      });
    });
  });

  describe('logout', () => {
    it('performs logout successfully', async () => {
      const mockCookies = {
        delete: jest.fn(),
      };
      
      (cookies as jest.Mock).mockReturnValue(mockCookies);
      
      const caller = authRouter.createCaller(mockContext);
      
      const result = await caller.logout();
      
      expect(result).toEqual({ success: true });
      expect(mockCookies.delete).toHaveBeenCalledWith('auth');
      expect(mockContext.logger.info).toHaveBeenCalledWith('User has been logged out');
    });

    it('handles logout when no cookie exists', async () => {
      const mockCookies = {
        delete: jest.fn(),
      };
      
      (cookies as jest.Mock).mockReturnValue(mockCookies);
      
      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.logout()).resolves.toEqual({ success: true });
      expect(mockCookies.delete).toHaveBeenCalledWith('auth');
    });
  });

  describe('register', () => {
    const validInput = {
      email: 'test@example.com',
      name: 'Test User',
    };

    it('creates new user and sends verification code', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        accountStatus: 'DISABLED',
      };

      const mockToken = {
        token: 'verification-token',
        expires: new Date(),
      };

      mockContext.db.user.findUnique.mockResolvedValue(null);
      mockContext.db.user.create.mockResolvedValue(mockUser);
      mockContext.db.verificationToken.create.mockResolvedValue(mockToken);

      // Mock sendEmail implementation
      mockSendEmail.mockImplementation(() => Promise.resolve(true));
      const mockSendEmail = sendEmail as jest.Mock;

      const caller = authRouter.createCaller(mockContext);
      
      const result = await caller.register(validInput);
      
      expect(result).toEqual({
        verificationToken: 'verification-token',
      });
      
      expect(mockContext.db.user.create).toHaveBeenCalledWith({
        data: {
          email: validInput.email,
          name: validInput.name,
          accountStatus: 'DISABLED',
        },
      });

      expect(sendEmail).toHaveBeenCalled();
      expect(mockContext.logger.info).toHaveBeenCalledWith('New user created');
    });

    it('throws error when user already exists', async () => {
      const existingUser = {
        id: 'existing-user',
        email: 'test@example.com',
        accountStatus: 'ENABLED',
      };

      mockContext.db.user.findUnique.mockResolvedValue(existingUser);

      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.register(validInput)).rejects.toThrow();
      
      expect(mockContext.logger.warn).toHaveBeenCalledWith('User already exists');
      expect(mockContext.db.user.create).not.toHaveBeenCalled();
    });

    it('validates email format', async () => {
      const invalidInput = {
        email: 'invalid-email',
        name: 'Test User',
      };

      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.register(invalidInput)).rejects.toThrow();
    });

    it('validates required name field', async () => {
      const invalidInput = {
        email: 'test@example.com',
        name: '',
      };

      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.register(invalidInput)).rejects.toThrow();
    });

    it('handles database errors during user creation', async () => {
      mockContext.db.user.findUnique.mockResolvedValue(null);
      mockContext.db.user.create.mockRejectedValue(new Error('Database error'));

      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.register(validInput)).rejects.toThrow();
    });
  });

  describe('validateEmail', () => {
    const validInput = {
      token: 'verification-token',
      code: '123456',
    };

    it('validates email successfully', async () => {
      const mockToken = {
        token: 'verification-token',
        userId: 'user-1',
        code: 'hashed-code',
        attempts: 0,
        lastAttemptAt: new Date(),
        expires: new Date(Date.now() + 10 * 60 * 1000),
      };

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        accountStatus: 'DISABLED',
      };

      // Mock the validateCode function
      const mockValidateCode = validateCode as jest.Mock;
      mockValidateCode.mockImplementation(() => Promise.resolve({
        verificationToken: mockToken,
        userJwt: "jwt-token",
      }));

      mockContext.db.user.update.mockResolvedValue({
        ...mockUser,
        accountStatus: 'ENABLED',
      });

      const mockCookies = {
        set: jest.fn(),
      };
      (cookies as jest.Mock).mockReturnValue(mockCookies);

      const caller = authRouter.createCaller(mockContext);
      
      const result = await caller.validateEmail(validInput);
      
      expect(result).toEqual({ success: true });
      expect(mockContext.db.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { accountStatus: 'ENABLED' },
      });
      expect(mockCookies.set).toHaveBeenCalledWith('auth', 'jwt-token', expect.any(Object));
    });

    it('handles invalid verification code', async () => {
      // Mock validateCode to throw error
      const mockValidateCode = validateCode as jest.Mock;
      mockValidateCode.mockImplementation(() => Promise.reject(new Error("Invalid code")));

      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.validateEmail(validInput)).rejects.toThrow('Invalid code');
    });

    it('validates input token format', async () => {
      const invalidInput = {
        token: '',
        code: '123456',
      };

      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.validateEmail(invalidInput)).rejects.toThrow();
    });

    it('validates input code format', async () => {
      const invalidInput = {
        token: 'verification-token',
        code: '',
      };

      const caller = authRouter.createCaller(mockContext);
      
      await expect(caller.validateEmail(invalidInput)).rejects.toThrow();
    });
  });

  describe('auth integration', () => {
    it('full registration and validation flow', async () => {
      // Step 1: Register
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        accountStatus: 'DISABLED',
      };

      const mockToken = {
        token: 'verification-token',
        userId: 'user-1',
        expires: new Date(),
      };

      mockContext.db.user.findUnique.mockResolvedValue(null);
      mockContext.db.user.create.mockResolvedValue(mockUser);
      mockContext.db.verificationToken.create.mockResolvedValue(mockToken);
      // Mock sendEmail implementation
      mockSendEmail.mockImplementation(() => Promise.resolve(true));
      const mockSendEmail = sendEmail as jest.Mock;

      const caller = authRouter.createCaller(mockContext);
      
      const registerResult = await caller.register({
        email: 'test@example.com',
        name: 'Test User',
      });
      
      expect(registerResult.verificationToken).toBe('verification-token');

      // Step 2: Check auth (should be false)
      let authResult = await caller.checkAuthenticated();
      expect(authResult.isAuthenticated).toBe(false);

      // Step 3: Validate email
      const mockValidateCode = validateCode as jest.Mock;
      mockValidateCode.mockImplementation(() => Promise.resolve({
        verificationToken: mockToken,
        userJwt: 'jwt-token',
      }));

      mockContext.db.user.update.mockResolvedValue({
        ...mockUser,
        accountStatus: 'ENABLED',
      });

      await caller.validateEmail({
        token: 'verification-token',
        code: '123456',
      });

      // Step 4: Check auth with enabled user
      mockContext = createMockContext({
        user: { ...mockUser, accountStatus: 'ENABLED', authorizations: ['USER'] },
      });
      const newCaller = authRouter.createCaller(mockContext);
      
      authResult = await newCaller.checkAuthenticated();
      expect(authResult.isAuthenticated).toBe(true);
      expect(authResult.authorizations).toContain('USER');
    });
  });
});