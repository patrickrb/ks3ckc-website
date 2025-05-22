/**
 * Type definitions for Blog and related entities
 */

/**
 * Represents a user who can author blog posts
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
 * Represents a blog post without populated author data
 */
export type Blog = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  [key: string]: unknown; // Allow for other properties
};

/**
 * Represents a blog post with populated author data
 */
export type BlogWithAuthor = Blog & {
  author: Author;
};

/**
 * Input type for creating a new blog
 */
export type BlogCreateInput = {
  title: string;
  content: string;
  featuredImage?: string;
};

/**
 * Input type for updating an existing blog
 */
export type BlogUpdateInput = {
  id: string;
  title?: string;
  content?: string;
  featuredImage?: string;
};
