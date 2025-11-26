// Constants
import { API_CONFIG, HTTP_METHODS } from '@app/constants/api';

// Stores
import { authStore } from '@app/stores/authStore';

// Utils
import qs from 'qs';

// Types
import type { ApiError, ApiRequestOptions } from '@app/interfaces/api';

export async function apiRequest<TResponse, TBody = unknown>(
  endpoint: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> {
  const {
    method = HTTP_METHODS.GET,
    query,
    body,
    auth = false,
    signal,
  } = options;

  // Build URL with query params
  let requestUrl = `${API_CONFIG.STRAPI_BASE_URL}${endpoint}`;

  if (query && Object.keys(query).length > 0) {
    const queryParams = qs.stringify(query, {
      encodeValuesOnly: true,
      skipNulls: true,
    });
    requestUrl += `?${queryParams}`;
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const accessToken = authStore.getState().accessToken;

    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  // Make HTTP request
  let httpResponse: Response;

  try {
    httpResponse = await fetch(requestUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Network request failed';

    throw new Error(`Network request failed: ${errorMessage}`);
  }

  // Parse response data
  const responseData = await httpResponse.json();

  if (!httpResponse.ok) {
    const responseError = responseData as {
      error?: ApiError;
      message?: string;
    };

    const apiError: ApiError = responseError?.error ?? {
      status: httpResponse.status,
      message:
        responseError?.message ?? httpResponse.statusText ?? 'Request failed',
    };

    throw apiError;
  }

  return responseData as TResponse;
}
