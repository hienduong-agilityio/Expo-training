import { render, screen } from '@testing-library/react-native';

// Components
import { GridProductList, IGridProductListProps } from '../GridProductList';

// Types
import type { IProductCardProps } from '@app/interfaces';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';

jest.mock('@app/components/ui', () => {
  const { View, Text } = require('react-native');

  const MockProductCard = ({ name, ...props }: IProductCardProps) => {
    return (
      <View {...props}>
        <Text>{name}</Text>
      </View>
    );
  };

  return {
    ProductCard: MockProductCard,
  };
});

describe('GridProductList', () => {
  const mockProducts = MOCK_PRODUCTS.slice(0, 3);
  const defaultProps = {
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
    });
  });
});
