import type { StrapiResponse } from './api';

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

export type IWishlistListResponse = StrapiResponse<IWishlist[]>;
export type IWishlistSingleResponse = StrapiResponse<IWishlist>;
