import type { StrapiPaginationMeta } from './api';

export interface IWishlistItem {
  productId: string;
}

export interface IWishlist {
  id: number;
  documentId: string;
  userId: string;
  products: IWishlistItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface IWishlistListResponse {
  data: IWishlist[];
  meta: StrapiPaginationMeta;
}

export interface IWishlistSingleResponse {
  data: IWishlist;
  meta: StrapiPaginationMeta;
}
