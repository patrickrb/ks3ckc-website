/**
 * Utility functions for handling user avatars
 */

/**
 * Get the avatar URL for a user, with fallback to a default avatar
 * @param userImage - The user's image from the database
 * @param fallbackSeed - Optional seed for generating a consistent default avatar
 * @returns Avatar URL to use
 */
export function getAvatarUrl(userImage: string | null | undefined, fallbackSeed?: string): string {
  if (userImage) {
    return userImage;
  }
  
  // Use a more reliable default avatar service or a static default
  // For now, we'll use a simple placeholder that doesn't require external services
  const seed = fallbackSeed || 'default';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=e2e8f0&color=4a5568&size=200`;
}

/**
 * Get fallback name for avatar generation
 * @param name - User's name
 * @param email - User's email
 * @returns A fallback name for avatar generation
 */
export function getAvatarFallbackName(name: string | null | undefined, email: string | null | undefined): string {
  return name || email || 'User';
}