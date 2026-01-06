import { StrapiResponse } from './api';

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

export type CartListResponse = StrapiResponse<Cart[]>;
export type CartSingleResponse = StrapiResponse<Cart>;
