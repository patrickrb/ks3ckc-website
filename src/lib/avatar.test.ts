import { getAvatarFallbackName, getAvatarUrl } from './avatar';

describe('avatar utilities', () => {
  describe('getAvatarUrl', () => {
    it('should return user image when provided', () => {
      const userImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...';
      expect(getAvatarUrl(userImage)).toBe(userImage);
    });

    it('should return default avatar URL when user image is null', () => {
      const result = getAvatarUrl(null, 'test@example.com');
      expect(result).toContain('ui-avatars.com');
      expect(result).toContain('test%40example.com');
    });

    it('should return default avatar URL when user image is undefined', () => {
      const result = getAvatarUrl(undefined, 'John Doe');
      expect(result).toContain('ui-avatars.com');
      expect(result).toContain('John%20Doe');
    });

    it('should use default seed when no fallback seed provided', () => {
      const result = getAvatarUrl(null);
      expect(result).toContain('ui-avatars.com');
      expect(result).toContain('default');
    });
  });

  describe('getAvatarFallbackName', () => {
    it('should return name when provided', () => {
      expect(getAvatarFallbackName('John Doe', 'john@example.com')).toBe(
        'John Doe'
      );
    });

    it('should return email when name is null', () => {
      expect(getAvatarFallbackName(null, 'john@example.com')).toBe(
        'john@example.com'
      );
    });

    it('should return email when name is undefined', () => {
      expect(getAvatarFallbackName(undefined, 'john@example.com')).toBe(
        'john@example.com'
      );
    });

    it('should return "User" when both name and email are null', () => {
      expect(getAvatarFallbackName(null, null)).toBe('User');
    });

    it('should return "User" when both name and email are undefined', () => {
      expect(getAvatarFallbackName(undefined, undefined)).toBe('User');
    });
  });
});
