import { IProductSize } from '@app/interfaces';

export const MOCK_SIZES: ReadonlyArray<IProductSize> = [
  { id: '1', size: 'XS', available: true },
  { id: '2', size: 'S', available: true },
  { id: '3', size: 'M', available: true },
  { id: '4', size: 'L', available: true },
  { id: '5', size: 'XL', available: true },
  { id: '6', size: 'XXL', available: false },
] as const;

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Black Winter Jacket',
    description: 'Autumn And Winter Casual cotton-padded jacket',
    brand: 'Winter Co.',
    price: 499,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 6890,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    },
  },
  {
    id: '2',
    name: 'Mens Starry Sky Printed Shirt',
    description: 'Mens Starry Sky Printed Shirt 100% Cotton Fabric',
    brand: 'Cotton Co.',
    price: 399,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 152344,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
    },
  },
  {
    id: '3',
    name: 'Black Dress',
    description: 'Solid Black Dress for Women, Sexy Chain Shorts',
    brand: 'Fashion Co.',
    price: 2000,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 523456,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
    },
  },
  {
    id: '4',
    name: 'Pink Embroidered Tiered Maxi Dress',
    description: 'EARTHEN Rose Pink Embroidered Tiered Maxi Dress',
    brand: 'Earthen',
    price: 1900,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 45678,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
    },
  },
  {
    id: '5',
    name: 'Flare Dress',
    description: 'Antheaa Black & Rust Orange Floral Print Tiered Midi Dress',
    brand: 'Antheaa',
    price: 1990,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 335566,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
    },
  },
  {
    id: '6',
    name: 'Denim Dress',
    description: 'Blue cotton denim dress Look 2 Printed cotton dress',
    brand: 'Denim Co.',
    price: 999,
    currency: 'INR' as const,
    rating: 2.0,
    reviewCount: 27344,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
    },
  },
  {
    id: '7',
    name: 'Jordan Stay',
    description: "The classic Air Jordan 12 to create a shoe that's fresh",
    brand: 'Nike',
    price: 4999,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 1023456,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop',
    },
  },
  {
    id: '8',
    name: 'Realme 7',
    description: '6 GB RAM | 64 GB ROM | Expandable Upto 256 GB',
    brand: 'Realme',
    price: 3499,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 344567,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=400&fit=crop',
    },
  },
  {
    id: '9',
    name: 'Sony PS4',
    description: 'Sony PS4 Console, 1TB Slim with 3 Games: Gran Turismo',
    brand: 'Sony',
    price: 1999,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 835566,
    imageSource: {},
  },
  {
    id: '10',
    name: 'Black Jacket',
    description: 'This warm and comfortable jacket is great for learning',
    brand: 'Outdoor Co.',
    price: 2999,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 223569,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    },
  },
  {
    id: '11',
    name: 'D7200 Digital Camera',
    description: 'D7200 Digital Camera (Nikon) In New Area',
    brand: 'Nikon',
    price: 26999,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 67456,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=400&fit=crop',
    },
  },
  {
    id: '12',
    name: "Men's & Boys Formal Shoes",
    description: 'George Walker Derby Brown Formal Shoes',
    brand: 'George Walker',
    price: 999,
    currency: 'INR' as const,
    rating: 5.0,
    reviewCount: 1345678,
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop',
    },
  },
] as const;

export const getMockProduct = (id: string) =>
  MOCK_PRODUCTS.find(product => product.id === id);
export const getMockProductsByBrand = (brand: string) =>
  MOCK_PRODUCTS.filter(product => product.brand === brand);
export const getMockProductsByPriceRange = (min: number, max: number) =>
  MOCK_PRODUCTS.filter(product => product.price >= min && product.price <= max);
export const getMockProductsByRating = (minRating: number) =>
  MOCK_PRODUCTS.filter(product => product.rating >= minRating);
