import { render, screen, fireEvent } from '@testing-library/react-native';

// Components
import { GridProductList } from '../GridProductList';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';
import { IProductCardProps } from '@app/interfaces';

describe('GridProductList', () => {
  const mockProps = {
    products: MOCK_PRODUCTS.slice(0, 3),
    onItemPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with products and matches snapshot', () => {
      const { toJSON } = render(
        <GridProductList
          {...mockProps}
          products={mockProps.products as unknown as IProductCardProps[]}
        />,
      );

      expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('handles empty products array', () => {
      render(
        <GridProductList
          products={[] as unknown as IProductCardProps[]}
          onItemPress={jest.fn()}
        />,
      );
      expect(screen.queryByText('Black Winter Jacket')).toBeNull();
    });

    it('renders with different configurations', () => {
      const testCases = [
        { name: 'custom numColumns', props: { numColumns: 3 } },
        {
          name: 'custom gap and padding',
          props: { gap: 20, contentPadding: 16 },
        },
        { name: 'with wishlist', props: { onWishlistToggle: jest.fn() } },
        {
          name: 'custom keyExtractor',
          props: {
            keyExtractor: (item: IProductCardProps) => `custom-${item.id}`,
          },
        },
        {
          name: 'custom style',
          props: {
            customStyle: { itemContainer: { backgroundColor: 'red' } },
          },
        },
      ];

      testCases.forEach(({ props }) => {
        const { unmount } = render(
          <GridProductList
            {...mockProps}
            {...props}
            products={mockProps.products as unknown as IProductCardProps[]}
          />,
        );
        expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
        unmount();
      });
    });

    it('handles edge cases for keyExtractor with null id and name', () => {
      const productsWithNullId = [
        { ...MOCK_PRODUCTS[0], id: null, name: null },
      ] as unknown as IProductCardProps[];

      render(
        <GridProductList
          products={productsWithNullId}
          onItemPress={jest.fn()}
        />,
      );

      expect(screen.queryByText('Black Winter Jacket')).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('calls onItemPress when product is pressed', () => {
      render(
        <GridProductList
          {...mockProps}
          products={mockProps.products as unknown as IProductCardProps[]}
        />,
      );

      const productCard = screen.getByLabelText(
        'Product: Black Winter Jacket, Price: 499 INR, Rating: 5 stars',
      );
      fireEvent.press(productCard);

      expect(mockProps.onItemPress).toHaveBeenCalledWith('1');
    });
  });
});
