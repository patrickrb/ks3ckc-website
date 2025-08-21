// Temporary mock types for @prisma/client when Prisma client cannot be generated
// This file provides minimal type definitions to allow TypeScript compilation

declare module '@prisma/client' {
  // Mock PrismaClient class
  export class PrismaClient {
    constructor(options?: any);

    // Database models based on schema (using lowercase for Prisma client)
    user: any;
    verificationToken: any;
    repository: any;
    blogs: any; // Note: model is "Blogs" but client uses lowercase "blogs"
    blogImage: any;
    news: any;
    event: any;

    // Standard Prisma methods
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction<T extends any[]>(queries: readonly [...T]): Promise<T>;
    $transaction<T>(fn: (client: this) => Promise<T>): Promise<T>;
  }

  // VerificationToken type based on Prisma schema
  export interface VerificationToken {
    userId: string;
    code: string;
    token: string;
    expires: Date;
    lastAttemptAt: Date;
    attempts: number;
    email: string | null;
  }

  // Mock Prisma namespace with actual classes for instanceof checks
  export namespace Prisma {
    export class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: any;
      constructor(message: string, code: string, meta?: any) {
        super(message);
        this.code = code;
        this.meta = meta;
      }
    }

    export class PrismaClientUnknownRequestError extends Error {}
    export class PrismaClientRustPanicError extends Error {}
    export class PrismaClientInitializationError extends Error {}
    export class PrismaClientValidationError extends Error {}

    // Additional Prisma types used in the codebase
    export interface LogLevel {}
    export interface LogDefinition {}

    // Common Prisma input types that are used in the codebase
    export interface BlogsWhereInput {
      [key: string]: any;
    }
    export interface UserWhereInput {
      [key: string]: any;
    }
    export interface EventWhereInput {
      [key: string]: any;
    }
    export interface NewsWhereInput {
      [key: string]: any;
    }
    export interface RepositoryWhereInput {
      [key: string]: any;
    }
    export interface VerificationTokenWhereInput {
      [key: string]: any;
    }

    // Add other input types as needed
    export interface BlogsOrderByInput {
      [key: string]: any;
    }
    export interface UserOrderByInput {
      [key: string]: any;
    }
    export interface EventOrderByInput {
      [key: string]: any;
    }
    export interface NewsOrderByInput {
      [key: string]: any;
    }
  }
}
