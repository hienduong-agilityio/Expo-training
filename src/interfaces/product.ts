import { CurrencyCode } from '@app/helpers';

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  price: number;
  currency?: CurrencyCode;
  rating?: number;
  reviewCount?: number;
  imageSource?: { uri: string };
}

export interface IProductDetailsProps {
  id: string;
  name: string;
  description: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: IProductSize[];
  details: string;
  features: IProductFeature[];
  onShowMoreDetails: () => void;
}

export interface IProductSize {
  id: string;
  size: string;
  available: boolean;
}

export interface IProductFeature {
  id: string;
  icon: string;
  title: string;
  description?: string;
}
