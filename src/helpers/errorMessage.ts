// Constants
import { ERROR_MESSAGES, FIREBASE_ERROR_MESSAGES } from '@app/constants/errors';

// Types
import type { ApiError } from '@app/interfaces/api';

/**
 * Extract error message from unknown error type
 */
export function extractErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : FIREBASE_ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Get API error message
 */
export function getApiErrorMessage(
  error: unknown,
  fallback: string = ERROR_MESSAGES.REQUEST_FAILED,
): string {
  if (!error) return fallback;

  const apiErr = error as ApiError;

  return apiErr.message ?? fallback;
}
