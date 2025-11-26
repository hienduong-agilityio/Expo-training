import { render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { FlatList } from 'react-native';

// Components
import { GridProductList, IGridProductListProps } from '../GridProductList';

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

describe('GridProductList', () => {
  const mockProducts = MOCK_PRODUCTS.slice(0, 3);
  const defaultProps = {
    listRef: createRef<FlatList<IProductCardProps>>(),
    products: mockProducts,
    gap: 16,
    contentPadding: 16,
    numColumns: 2,
  };

  const renderComponent = (overrides = {}) =>
    render(
      <GridProductList
        {...(defaultProps as unknown as IGridProductListProps)}
        {...overrides}
      />,
    );

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
