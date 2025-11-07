import { render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { FlatList } from 'react-native';

// Components
import { ProductList } from '../index';

// Types
import type { IProductCardProps } from '@app/interfaces';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';

jest.mock('../../ProductCard', () => ({
  ProductCard: ({ name, ...props }: IProductCardProps) => {
    const MockView = require('react-native').View;
    const MockText = require('react-native').Text;

    return (
      <MockView {...props}>
        <MockText>{name}</MockText>
      </MockView>
    );
  },
}));

describe('ProductList', () => {
  const mockProducts = MOCK_PRODUCTS.slice(0, 3);
  const defaultProps = {
    listRef: createRef<FlatList<IProductCardProps>>(),
    products: mockProducts as IProductCardProps[],
    estimatedItemSize: 200,
    gap: 16,
    contentPadding: 216,
  };

  const renderComponent = (overrides = {}) =>
    render(<ProductList {...defaultProps} {...overrides} />);

  describe('Rendering', () => {
    it('matches snapshot', () => {
      const { toJSON } = renderComponent();

      expect(toJSON()).toMatchSnapshot();
    });

    it('renders products correctly', () => {
      renderComponent();

      mockProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeTruthy();
      });

      expect(defaultProps.listRef.current).toBeDefined();
    });
  });
});
