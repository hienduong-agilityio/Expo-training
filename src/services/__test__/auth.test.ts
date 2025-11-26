import { authService } from '../auth';
import { apiRequest } from '../apiClient';

jest.mock('../apiClient');

describe('authService', () => {
  const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('calls apiRequest with correct parameters', async () => {
      const mockPayload = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const mockResponse = {
        jwt: 'token',
        user: { id: '1', email: 'test@example.com' },
      };

      mockApiRequest.mockResolvedValueOnce(mockResponse);

      const result = await authService.signUp(mockPayload);

      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: mockPayload,
          auth: false,
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('calls apiRequest with correct parameters', async () => {
      const mockPayload = {
        identifier: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        jwt: 'token',
        user: { id: '1', email: 'test@example.com' },
      };

      mockApiRequest.mockResolvedValueOnce(mockResponse);

      const result = await authService.login(mockPayload);

      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: mockPayload,
          auth: false,
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
