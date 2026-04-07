import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// Components
import { ProductDetails } from './index';

// Types
const meta: Meta<typeof ProductDetails> = {
  title: 'UI/ProductDetails',
  component: ProductDetails,
  args: {
    id: '1',
    name: 'Flare Dress',
    description: 'Beautiful flare dress perfect for any occasion',
    price: 1999,
    originalPrice: 2999,
    discountPercent: 33,
    currency: 'INR',
    rating: 4.5,
    reviewCount: 1234,
    details:
      'This beautiful flare dress is made from high-quality fabric and features a flattering silhouette that works for any body type. Perfect for parties, weddings, or any special occasion.',

    onShowMoreDetails: () => {},
  },
  parameters: {
    notes:
      'Product information component showing details, pricing, and ratings.',
  },
  argTypes: {
    id: { description: 'Product ID', control: 'text' },
    name: { description: 'Product name', control: 'text' },
    description: { description: 'Product description', control: 'text' },
    price: { description: 'Product price', control: 'number' },
    originalPrice: { description: 'Product original price', control: 'number' },
    discountPercent: {
      description: 'Product discount percent',
      control: 'number',
    },
    currency: { description: 'Product currency', control: 'text' },
    rating: { description: 'Product rating', control: 'number' },
    reviewCount: { description: 'Product review count', control: 'number' },
    details: { description: 'Product details', control: 'text' },
    onShowMoreDetails: {
      description: 'Callback when show more is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductDetails>;

export const Default: Story = {};

export const WithDiscount: Story = {
  args: {
    id: '2',
    name: 'Summer Blouse',
    description: 'Light and airy summer blouse',
    price: 899,
    originalPrice: 1299,
    discountPercent: 31,
    currency: 'INR',
    rating: 4.2,
    reviewCount: 567,
    details: 'Perfect summer blouse with breathable fabric.',
  },
};

export const WithoutDiscount: Story = {
  args: {
    id: '3',
    name: 'Classic T-Shirt',
    description: 'Basic comfortable t-shirt',
    price: 599,
    currency: 'INR',
    rating: 4.0,
    reviewCount: 89,
    details: 'Simple and comfortable everyday t-shirt.',
  },
};

export const HighRating: Story = {
  args: {
    id: '4',
    name: 'Premium Jacket',
    description: 'High-quality premium jacket',
    price: 4999,
    originalPrice: 5999,
    discountPercent: 17,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 2500,
    details: 'Premium quality jacket with excellent craftsmanship.',
  },
};

export const WithCallbacks: Story = {
  args: {
    onShowMoreDetails: action('onShowMoreDetails'),
  },
};
