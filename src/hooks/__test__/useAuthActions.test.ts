import { renderHook, act, waitFor } from '@testing-library/react-native';

// Hooks
import { useAuthActions } from '../useAuthActions';

// Services
import { authService } from '@app/services/auth';

// Stores
import { authStore } from '@app/stores/authStore';

// Tanstack Query
import { useQueryClient } from '@tanstack/react-query';
import { AuthResponse } from '@app/interfaces/auth';

jest.mock('@app/services/auth');
jest.mock('@app/stores/authStore');
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

describe('useAuthActions', () => {
  const mockSetSession = jest.fn();
  const mockClearSession = jest.fn();
  const mockRemoveQueries = jest.fn();
  const mockQueryClient = {
    removeQueries: mockRemoveQueries,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authStore as unknown as jest.Mock).mockImplementation(selector => {
      const state = {
        setSession: mockSetSession,
        clearSession: mockClearSession,
      };
      return selector ? selector(state) : state;
    });
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
  });

  it('initializes with isSubmitting false', () => {
    const { result } = renderHook(() => useAuthActions());

    expect(result.current.isSubmitting).toBe(false);
  });

  it('logs in successfully', async () => {
    const mockResponse = {
      jwt: 'token',
      user: { id: '1', email: 'test@example.com' },
    };

    (authService.login as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuthActions());

    await act(async () => {
      await result.current.login({
        identifier: 'test@example.com',
        password: 'password',
      });
    });

    expect(authService.login).toHaveBeenCalledWith({
      identifier: 'test@example.com',
      password: 'password',
    });
    expect(mockSetSession).toHaveBeenCalledWith(mockResponse);
    expect(mockRemoveQueries).toHaveBeenCalled();
  });

  it('registers successfully', async () => {
    const mockResponse = {
      jwt: 'token',
      user: { id: '1', email: 'test@example.com' },
    };

    (authService.signUp as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuthActions());

    await act(async () => {
      const response = await result.current.register({
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      });

      expect(response).toEqual(mockResponse);
    });

    expect(authService.signUp).toHaveBeenCalled();
  });

  it('logs out successfully', async () => {
    const { result } = renderHook(() => useAuthActions());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockClearSession).toHaveBeenCalled();
    expect(mockRemoveQueries).toHaveBeenCalled();
  });

  it('sets isSubmitting during login', async () => {
    let resolveLogin: (value: AuthResponse) => void;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });

    (authService.login as jest.Mock).mockReturnValueOnce(loginPromise);

    const { result } = renderHook(() => useAuthActions());

    act(() => {
      result.current.login({
        identifier: 'test@example.com',
        password: 'password',
      });
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    act(() => {
      resolveLogin?.({
        jwt: 'token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          documentId: '',
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('handles login error and resets isSubmitting', async () => {
    const error = new Error('Login failed');
    (authService.login as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuthActions());

    await act(async () => {
      await expect(
        result.current.login({
          identifier: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow('Login failed');
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it('handles register error and resets isSubmitting', async () => {
    const error = new Error('Register failed');
    (authService.signUp as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuthActions());

    await act(async () => {
      await expect(
        result.current.register({
          email: 'test@example.com',
          password: 'password',
          username: 'testuser',
        }),
      ).rejects.toThrow('Register failed');
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('sets isSubmitting during register', async () => {
    let resolveRegister: (value: AuthResponse) => void;
    const registerPromise = new Promise(resolve => {
      resolveRegister = resolve;
    });

    (authService.signUp as jest.Mock).mockReturnValueOnce(registerPromise);

    const { result } = renderHook(() => useAuthActions());

    act(() => {
      result.current.register({
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      });
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    act(() => {
      resolveRegister!({
        jwt: 'token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          documentId: '',
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
