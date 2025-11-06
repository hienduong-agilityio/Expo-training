import { render, screen, fireEvent } from '@testing-library/react-native';

// Components
import { ProductCard } from '@app/components/ui/ProductCard';

// Mocks
import { getMockProduct } from '@app/mocks/products';

describe('ProductCard', () => {
  const product = getMockProduct('1')!;

  const renderProductCard = (overrides = {}) => {
    return render(<ProductCard {...product} {...overrides} />);
  };

  const createTestProduct = (overrides = {}) => ({
    id: 'test-id',
    name: 'Test Product',
    price: 100,
    rating: 3.5,
    ...overrides,
  });

  describe('Rendering', () => {
    it('renders product information correctly', () => {
      renderProductCard();

      expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
      expect(screen.getByText('₹ 499')).toBeTruthy();
      expect(screen.getByText('6,890')).toBeTruthy();
      expect(
        screen.getByText('Autumn And Winter Casual cotton-padded jacket'),
      ).toBeTruthy();
    });

    it('renders with different prop variations', () => {
      const testCases = [
        {
          name: 'minimal props',
          props: createTestProduct(),
          expectations: () => {
            expect(screen.getByText('Test Product')).toBeTruthy();
            expect(screen.getByText('Test Product')).toBeTruthy();
            expect(screen.getByText('₹ 100')).toBeTruthy();
          },
        },
        {
          name: 'null imageSource',
          props: { imageSource: null },
          expectations: () => {
            expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
          },
        },
        {
          name: 'without review count',
          props: { reviewCount: undefined },
          expectations: () => {
            expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
            expect(screen.queryByText('6,890')).toBeFalsy();
          },
        },
        {
          name: 'different currency',
          props: { currency: 'USD' as const },
          expectations: () => {
            expect(screen.getByText('$ 499')).toBeTruthy();
          },
        },
        {
          name: 'custom style',
          props: { style: { marginTop: 20 } },
          expectations: () => {
            expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
          },
        },
      ];

      testCases.forEach(({ props, expectations }) => {
        renderProductCard(props);
        expectations();
      });
    });
  });

  describe('Interactions', () => {
    it('handles callbacks correctly', () => {
      const onPress = jest.fn();
      const onWishlistToggle = jest.fn();

      renderProductCard({ onPress, onWishlistToggle });

      // Test onPress callback
      fireEvent.press(
        screen.getByLabelText(
          'Product: Black Winter Jacket, Price: 499 INR, Rating: 5 stars',
        ),
      );
      expect(onPress).toHaveBeenCalledWith('1');
    });

    it('handles wishlist states correctly', () => {
      const testCases = [
        {
          name: 'no wishlist functionality',
          props: {},
          expectations: () => {
            expect(screen.queryByLabelText('Add to wishlist')).toBeFalsy();
            expect(screen.queryByLabelText('Remove from wishlist')).toBeFalsy();
          },
        },
        {
          name: 'wishlisted true',
          props: { onWishlistToggle: jest.fn(), isWishlisted: true },
          expectations: () => {
            expect(screen.getByLabelText('Remove from wishlist')).toBeTruthy();
          },
        },
        {
          name: 'wishlisted false',
          props: { onWishlistToggle: jest.fn(), isWishlisted: false },
          expectations: () => {
            expect(screen.getByLabelText('Add to wishlist')).toBeTruthy();
          },
        },
      ];

      testCases.forEach(({ props, expectations }) => {
        renderProductCard(props);
        expectations();
      });
    });
  });

  describe('Description Logic', () => {
    it('handles description fallback logic', () => {
      const testCases = [
        {
          name: 'with description',
          props: { description: 'Custom description' },
          expectations: () => {
            expect(screen.getByText('Custom description')).toBeTruthy();
          },
        },
        {
          name: 'without description, with brand',
          props: { description: undefined },
          expectations: () => {
            expect(
              screen.getByText('Winter Co. Black Winter Jacket'),
            ).toBeTruthy();
          },
        },
        {
          name: 'without description and brand',
          props: { description: undefined, brand: undefined },
          expectations: () => {
            expect(screen.getAllByText('Black Winter Jacket')).toHaveLength(2);
          },
        },
        {
          name: 'empty description and brand',
          props: { description: '', brand: '', name: 'Test Product' },
          expectations: () => {
            expect(screen.getAllByText('Test Product')).toHaveLength(2);
          },
        },
      ];

      testCases.forEach(({ props, expectations }) => {
        renderProductCard(props);
        expectations();
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility attributes', () => {
      renderProductCard();

      expect(
        screen.getByLabelText(
          'Product: Black Winter Jacket, Price: 499 INR, Rating: 5 stars',
        ),
      ).toBeTruthy();
      expect(screen.getByRole('button')).toBeTruthy();
    });
  });

  describe('Snapshots', () => {
    it('matches snapshots for different states', () => {
      const testCases = [
        {
          name: 'complete product data',
          props: {},
        },
        {
          name: 'with wishlist functionality',
          props: { onWishlistToggle: jest.fn(), isWishlisted: true },
        },
      ];

      testCases.forEach(({ name, props }) => {
        const view = renderProductCard(props);
        expect(view).toMatchSnapshot(name);
      });
    });
  });
});
