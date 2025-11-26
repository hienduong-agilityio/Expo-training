// Types
import type { ApiError } from '@app/interfaces/api';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Request failed',
): string {
  if (!error) return fallback;

  const apiErr = error as ApiError;

  return apiErr.message ?? fallback;
}
