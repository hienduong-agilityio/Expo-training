import { validateLogin, validateRegister } from '../validation';

describe('validation helpers', () => {
  describe('validateLogin', () => {
    it('returns success for valid login data', () => {
      const result = validateLogin({
        identifier: 'test@example.com',
        password: 'password123',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.payload).toEqual({
          identifier: 'test@example.com',
          password: 'password123',
        });
      }
    });

    it('returns errors for invalid login data', () => {
      const result = validateLogin({
        identifier: '',
        password: '',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors).toBeDefined();
        expect(Object.keys(result.errors).length).toBeGreaterThan(0);
      }
    });

    it('returns errors for empty identifier', () => {
      const result = validateLogin({
        identifier: '',
        password: 'password123',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.identifier).toBeDefined();
      }
    });
  });

  describe('validateRegister', () => {
    it('returns success for valid register data', () => {
      const result = validateRegister({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.payload).toEqual({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });
      }
    });

    it('returns errors for invalid register data', () => {
      const result = validateRegister({
        username: '',
        email: 'invalid',
        password: '123',
        confirmPassword: '456',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors).toBeDefined();
      }
    });

    it('returns errors when passwords do not match', () => {
      const result = validateRegister({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      });

      expect(result.ok).toBe(false);
    });
  });
});
