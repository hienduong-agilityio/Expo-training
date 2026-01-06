import { ERROR_MESSAGES } from '@app/constants';
import { getApiErrorMessage } from '../errorMessage';
import { ApiError } from '@app/interfaces/api';

describe('getApiErrorMessage', () => {
  it('returns fallback when error is null', () => {
    expect(getApiErrorMessage(null)).toBe('Request failed');
  });

  it('returns fallback when error is undefined', () => {
    expect(getApiErrorMessage(undefined)).toBe('Request failed');
  });

  it('returns custom fallback message', () => {
    expect(
      getApiErrorMessage(
        null as unknown as ApiError,
        ERROR_MESSAGES.REQUEST_FAILED,
      ),
    ).toBe(ERROR_MESSAGES.REQUEST_FAILED);
  });

  it('returns error message when ApiError has message', () => {
    const error = { message: 'Network error', status: 500 };
    expect(getApiErrorMessage(error)).toBe('Network error');
  });

  it('returns fallback when ApiError has no message', () => {
    const error = { status: 500 };
    expect(getApiErrorMessage(error)).toBe('Request failed');
  });
});
