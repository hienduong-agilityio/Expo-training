import { StrapiPaginationMeta } from './api';

export interface ICartItem {
  productId: string;
  quantity: number;
}

export type CartStatus = 'active' | 'abandoned' | 'completed';

export interface Cart {
  id: number;
  documentId: string;
  userId: string;
  cart_status: CartStatus;
  products: ICartItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface CartListResponse {
  data: Cart[];
  meta: StrapiPaginationMeta;
}

export interface CartSingleResponse {
  data: Cart;
  meta: StrapiPaginationMeta;
}
