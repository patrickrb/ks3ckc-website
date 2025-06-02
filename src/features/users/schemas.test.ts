import { USER_AUTHORIZATIONS, UserAuthorization } from '@/features/users/schemas';

describe('User Authorizations', () => {
  it('should include CONTRIBUTOR authorization', () => {
    expect(USER_AUTHORIZATIONS).toContain('CONTRIBUTOR');
  });

  it('should have correct authorization order', () => {
    expect(USER_AUTHORIZATIONS).toEqual(['APP', 'CONTRIBUTOR', 'ADMIN']);
  });

  it('should maintain backward compatibility with existing authorizations', () => {
    expect(USER_AUTHORIZATIONS).toContain('APP');
    expect(USER_AUTHORIZATIONS).toContain('ADMIN');
  });
});