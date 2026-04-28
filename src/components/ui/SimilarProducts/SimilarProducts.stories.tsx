import type { Meta, StoryObj } from '@storybook/react';

// Components
import { SimilarProducts } from './index';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';

// Types
import type { IProduct } from '@app/interfaces';

const meta: Meta<typeof SimilarProducts> = {
  title: 'UI/SimilarProducts',
  component: SimilarProducts,
  parameters: {
    docs: {
      description: {
        component:
          'A component that displays similar products with action buttons and filtering options.',
      },
    },
  },
  argTypes: {
    products: {
      description: 'Array of similar products to display',
      control: { type: 'object' },
    },
    onViewSimilar: {
      description: 'Callback function when "View Similar" button is pressed',
      action: 'onViewSimilar',
    },
    onAddToCompare: {
      description: 'Callback function when "Add to Compare" button is pressed',
      action: 'onAddToCompare',
    },
    onProductPress: {
      description: 'Callback function when a product is pressed',
      action: 'onProductPress',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SimilarProducts>;

export const Default: Story = {
  args: {
    products: MOCK_PRODUCTS.slice(0, 4) as unknown as IProduct[],
    onViewSimilar: () => {},
    onAddToCompare: () => {},
    onProductPress: () => {},
  },
};

export const WithManyProducts: Story = {
  args: {
    products: MOCK_PRODUCTS.slice(0, 8) as unknown as IProduct[],
    onViewSimilar: () => {},
    onAddToCompare: () => {},
    onProductPress: () => {},
  },
};

export const EmptyState: Story = {
  args: {
    products: [],
    onViewSimilar: () => {},
    onAddToCompare: () => {},
    onProductPress: () => {},
  },
};

export const SingleProduct: Story = {
  args: {
    products: MOCK_PRODUCTS.slice(0, 1) as unknown as IProduct[],
    onViewSimilar: () => {},
    onAddToCompare: () => {},
    onProductPress: () => {},
  },
};
