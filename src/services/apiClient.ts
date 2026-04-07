import qs from 'qs';

// Constants
import { API_CONFIG, HTTP_METHODS } from '@app/constants/api';
import { ERROR_MESSAGES } from '@app/constants/errors';

// Stores
import { authStore } from '@app/stores/authStore';

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
    auth = true, // Default to true for authenticated requests
    signal,
  } = options;

  // Build URL with query params
  let requestUrl = `${API_CONFIG.STRAPI_BASE_URL}${endpoint}`;

  if (query && Object.keys(query).length > 0) {
    let queryParams = qs.stringify(query, {
      encodeValuesOnly: true,
      skipNulls: true,
    });

    if (query.populate === '*') {
      queryParams = queryParams.replace(/populate=%2A/g, 'populate=*');
    }

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
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.NETWORK_REQUEST_FAILED;

    throw new Error(
      `${ERROR_MESSAGES.NETWORK_REQUEST_FAILED}: ${errorMessage}`,
    );
  }

  // Parse response data
  let responseData: unknown;

  try {
    responseData = await httpResponse.json();
  } catch {
    throw new Error(ERROR_MESSAGES.REQUEST_FAILED);
  }

  if (!httpResponse.ok) {
    const responseError = responseData as {
      error?: ApiError;
      message?: string;
    };

    const apiError: ApiError = responseError?.error ?? {
      status: httpResponse.status,
      message:
        responseError?.message ??
        httpResponse.statusText ??
        ERROR_MESSAGES.REQUEST_FAILED,
    };

    throw apiError;
  }

  return responseData as TResponse;
}
