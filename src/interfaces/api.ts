import type { HTTP_METHODS } from '@app/constants/api';

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  query?: Record<string, unknown>;
  body?: TBody;
  auth?: boolean;
  signal?: AbortSignal;
}

export interface StrapiPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiSingle<T> {
  data: {
    id: number;
    attributes: T;
  } | null;
}

export interface StrapiList<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: StrapiPaginationMeta;
}
