import { AuthResponse, AuthUser } from '@app/interfaces/auth';
import { authStore } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    authStore.setState({
      accessToken: null,
      user: null,
    });
  });

  it('initializes with null values', () => {
    const state = authStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });

  it('sets session correctly', () => {
    const mockResponse = {
      jwt: 'test-token',
      user: {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    authStore
      .getState()
      .setSession(mockResponse as unknown as AuthResponse & { user: AuthUser });

    const state = authStore.getState();
    expect(state.accessToken).toBe('test-token');
    expect(state.user).toEqual(mockResponse.user);
  });

  it('clears session correctly', () => {
    // First set a session
    authStore.getState().setSession({
      jwt: 'test-token',
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        documentId: '1',
      },
    });

    // Then clear it
    authStore.getState().clearSession();

    const state = authStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });
});
