import { apiRequest } from '../apiClient';
import { authStore } from '@app/stores/authStore';

// Mock fetch
global.fetch = jest.fn();

// Mock authStore
jest.mock('@app/stores/authStore', () => ({
  authStore: jest.fn(),
}));

describe('apiClient', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  const mockAuthStore = authStore as jest.MockedFunction<typeof authStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthStore.getState = jest.fn(() => ({
      accessToken: null,
    })) as unknown as jest.MockedFunction<typeof authStore.getState>;
  });

  it('makes GET request successfully', async () => {
    const mockResponse = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await apiRequest('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('includes query parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test', {
      query: { page: 1, limit: 10 },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('page=1'),
      expect.any(Object),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('limit=10'),
      expect.any(Object),
    );
  });

  it('includes authorization header when auth is true', async () => {
    mockAuthStore.getState = jest.fn(() => ({
      accessToken: 'test-token',
    })) as unknown as jest.MockedFunction<typeof authStore.getState>;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test', { auth: true });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    );
  });

  it('makes POST request with body', async () => {
    const mockBody = { name: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test', {
      method: 'POST',
      body: mockBody,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockBody),
      }),
    );
  });

  it('throws error on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(apiRequest('/test')).rejects.toThrow('Network request failed');
  });

  it('throws API error on non-ok response', async () => {
    const errorResponse = {
      error: { status: 400, message: 'Bad Request' },
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => errorResponse,
    } as Response);

    await expect(apiRequest('/test')).rejects.toMatchObject({
      status: 400,
      message: 'Bad Request',
    });
  });

  it('handles error response without error object', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error' }),
    } as Response);

    await expect(apiRequest('/test')).rejects.toMatchObject({
      status: 500,
      message: 'Server error',
    });
  });

  it('handles error response without message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    } as Response);

    await expect(apiRequest('/test')).rejects.toMatchObject({
      status: 500,
      message: 'Internal Server Error',
    });
  });

  it('handles error when accessToken is null with auth true', async () => {
    mockAuthStore.getState = jest.fn(() => ({
      accessToken: null,
    })) as unknown as jest.MockedFunction<typeof authStore.getState>;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test', { auth: true });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      }),
    );
  });

  it('handles request with signal', async () => {
    const abortController = new AbortController();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test', { signal: abortController.signal });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: abortController.signal,
      }),
    );
  });

  it('does not include query params when query is empty object', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test', { query: {} });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^[^?]+$/), // URL without query params
      expect.any(Object),
    );
  });

  it('does not include query params when query is not provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^[^?]+$/), // URL without query params
      expect.any(Object),
    );
  });

  it('does not include body when body is not provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest('/test', { method: 'POST' });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: undefined,
      }),
    );
  });

  it('handles network error that is not an Error instance', async () => {
    mockFetch.mockRejectedValueOnce('String error');

    await expect(apiRequest('/test')).rejects.toThrow('Network request failed');
  });

  it('handles error response with null statusText', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: null as unknown as string,
      json: async () => ({}),
    } as Response);

    await expect(apiRequest('/test')).rejects.toMatchObject({
      status: 500,
      message: 'Request failed',
    });
  });

  it('handles error response with empty statusText', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: '',
      json: async () => ({}),
    } as Response);

    await expect(apiRequest('/test')).rejects.toMatchObject({
      status: 500,
      message: '',
    });
  });
});
