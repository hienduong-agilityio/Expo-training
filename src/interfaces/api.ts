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

export interface ApiProduct {
  documentId?: string;
  id: number;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  deals: ApiDeal[];
  discountPercent?: number;
  trendings: ApiTrending[];
  ratingAvg?: number;
  ratingCount?: number;
  images?: ApiMedia[];
  brand?: ApiBrand;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ApiMedia {
  id: number;
  name: string;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
}

export interface ApiDeal {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  startsAt: string;
  endsAt: string;
  products?: ApiProduct[];
}

export interface ApiTrending {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  lastDate?: string;
  products?: ApiProduct[];
}

export interface ApiCategory {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  attributes?: {
    slug?: string;
  };
}

export type ApiProductWithCategories = ApiProduct & {
  categories?: ApiCategory[];
  category?: ApiCategory;
  categorySlug?: string;
};
