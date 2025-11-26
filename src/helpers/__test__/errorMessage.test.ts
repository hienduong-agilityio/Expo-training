import { getApiErrorMessage } from '../errorMessage';

describe('getApiErrorMessage', () => {
  it('returns fallback when error is null', () => {
    expect(getApiErrorMessage(null)).toBe('Request failed');
  });

  it('returns fallback when error is undefined', () => {
    expect(getApiErrorMessage(undefined)).toBe('Request failed');
  });

  it('returns custom fallback message', () => {
    expect(getApiErrorMessage(null, 'Custom error')).toBe('Custom error');
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
