// Services
import { apiRequest } from '@app/services/apiClient';

// Constants
import { AUTH_ENDPOINTS } from '@app/constants/auth';
import { HTTP_METHODS } from '@app/constants/api';

// Types
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@app/interfaces/auth';

/**
 * Handles user registration
 */
const signUp = (payload: RegisterPayload) =>
  apiRequest<AuthResponse, RegisterPayload>(AUTH_ENDPOINTS.SIGN_UP, {
    method: HTTP_METHODS.POST,
    body: payload,
    auth: false,
  });

/**
 * Handles user login
 */
const login = (payload: LoginPayload) =>
  apiRequest<AuthResponse, LoginPayload>(AUTH_ENDPOINTS.LOGIN, {
    method: HTTP_METHODS.POST,
    body: payload,
    auth: false,
  });

export const authService = {
  signUp,
  login,
} as const;
