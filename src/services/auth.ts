import { apiRequest } from '@app/services/apiClient';

// Types
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@app/interfaces/auth';

// Constants
import { AUTH_ENDPOINTS } from '@app/constants/auth';
import { HTTP_METHODS } from '@app/constants/api';

export const authService = {
  signUp: (payload: RegisterPayload) =>
    apiRequest<AuthResponse, RegisterPayload>(AUTH_ENDPOINTS.SIGN_UP, {
      method: HTTP_METHODS.POST,
      body: payload,
      auth: false,
    }),
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse, LoginPayload>(AUTH_ENDPOINTS.LOGIN, {
      method: HTTP_METHODS.POST,
      body: payload,
      auth: false,
    }),
} as const;
