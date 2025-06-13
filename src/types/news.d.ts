/**
 * Type definitions for News and related entities
 */

/**
 * Represents a user who can author news entries
 */
export type Author = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  email: string;
  accountStatus: string;
  image: string | null;
  authorizations: string[];
  language: string;
  callsign: string | null;
  dmrid: number | null; // Always stored as number in the database
  isPubliclyVisible: boolean;
  notes: string | null;
  lastLoginAt?: Date | null;
  [key: string]: unknown; // Allow for other properties
};

/**
 * Represents a news entry without populated author data
 */
export type News = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  authorId: string;
  [key: string]: unknown; // Allow for other properties
};

/**
 * Represents a news entry with populated author data
 */
export type NewsWithAuthor = News & {
  author: Author;
};

/**
 * Input type for creating a new news entry
 */
export type NewsCreateInput = {
  title: string;
  content: string;
};

/**
 * Input type for updating an existing news entry
 */
export type NewsUpdateInput = {
  id: string;
  title?: string;
  content?: string;
};
