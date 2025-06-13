import { TRPCClientError } from '@trpc/client';

import { isErrorDatabaseConflict } from './errors';

describe('tRPC error utilities', () => {
  describe('isErrorDatabaseConflict', () => {
    it('should return true for valid database conflict error', () => {
      // Create a mock TRPCClientError with the expected data structure
      const error = {
        data: {
          code: 'CONFLICT',
          prismaError: {
            target: ['email', 'username'],
          },
        },
      } as TRPCClientError<any>;

      // Make it an instance of TRPCClientError
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'email')).toBe(true);
      expect(isErrorDatabaseConflict(error, 'username')).toBe(true);
    });

    it('should return false for field not in target array', () => {
      const error = {
        data: {
          code: 'CONFLICT',
          prismaError: {
            target: ['email', 'username'],
          },
        },
      } as TRPCClientError<any>;
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'phone')).toBe(false);
    });

    it('should return false for non-TRPCClientError', () => {
      const error = new Error('Regular error');
      expect(isErrorDatabaseConflict(error, 'email')).toBe(false);
    });

    it('should return false for TRPCClientError without CONFLICT code', () => {
      const error = {
        data: {
          code: 'NOT_FOUND',
          prismaError: {
            target: ['email'],
          },
        },
      } as TRPCClientError<any>;
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'email')).toBe(false);
    });

    it('should return false when data is missing', () => {
      const error = {
        data: undefined,
      } as TRPCClientError<any>;
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'email')).toBe(false);
    });

    it('should return false when prismaError is missing', () => {
      const error = {
        data: {
          code: 'CONFLICT',
        },
      } as TRPCClientError<any>;
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'email')).toBe(false);
    });

    it('should return false when target is not an array', () => {
      const error = {
        data: {
          code: 'CONFLICT',
          prismaError: {
            target: 'email',
          },
        },
      } as TRPCClientError<any>;
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'email')).toBe(false);
    });

    it('should return false when target array contains non-strings', () => {
      const error = {
        data: {
          code: 'CONFLICT',
          prismaError: {
            target: ['email', 123, null],
          },
        },
      } as TRPCClientError<any>;
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'email')).toBe(false);
    });

    it('should handle null/undefined error input', () => {
      expect(isErrorDatabaseConflict(null, 'email')).toBe(false);
      expect(isErrorDatabaseConflict(undefined, 'email')).toBe(false);
    });

    it('should handle string error input', () => {
      expect(isErrorDatabaseConflict('Error string', 'email')).toBe(false);
    });

    it('should handle empty target array', () => {
      const error = {
        data: {
          code: 'CONFLICT',
          prismaError: {
            target: [],
          },
        },
      } as TRPCClientError<any>;
      Object.setPrototypeOf(error, TRPCClientError.prototype);

      expect(isErrorDatabaseConflict(error, 'email')).toBe(false);
    });
  });
});
