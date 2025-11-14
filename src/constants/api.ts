import Config from 'react-native-config';

export const API_CONFIG = {
  BASE_URL: Config.API_BASE_URL,
  STRAPI_BASE_URL: Config.STRAPI_BASE_URL,
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;
