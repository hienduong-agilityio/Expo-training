import { CurrencyCode } from '@app/helpers';
import { ApiProduct } from '@app/interfaces/api';

export interface IProduct extends Omit<ApiProduct, 'id'> {
  id: string;
  name: string;
  currency?: CurrencyCode;
  rating?: number;
  description?: string;
  reviewCount?: number;
  imageSource?: { uri: string };
}

export interface IProductDetailsProps extends IProduct {
  originalPrice?: number;
  discountPercent?: number;
  sizes: IProductSize[];
  features: IProductFeature[];
  details?: string;
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

export interface CategorizedProducts {
  deals: import('./ui').IProductCardProps[];
  trending: import('./ui').IProductCardProps[];
  newArrivals: import('./ui').IProductCardProps[];
}
