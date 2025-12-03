import { render, screen, fireEvent } from '@testing-library/react-native';

// Components
import { ProductCard } from '@app/components/ui/ProductCard';

// Mocks
import { getMockProduct } from '@app/mocks/products';

// Types
import type { IProductCardProps } from '@app/interfaces/ui';

describe('ProductCard', () => {
  const product = getMockProduct('1')!;

  const renderProductCard = (overrides = {}) => {
    return render(
      <ProductCard
        {...(product as unknown as IProductCardProps)}
        {...overrides}
      />,
    );
  };

  describe('Rendering', () => {
    it('renders product information correctly', () => {
      renderProductCard();

      expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
      expect(screen.getByText('₹ 499.00')).toBeTruthy();
      expect(screen.getByText('6,890')).toBeTruthy();
      expect(
        screen.getByText('Autumn And Winter Casual cotton-padded jacket'),
      ).toBeTruthy();
    });

    it('renders with different prop variations', () => {
      const testCases = [
        {
          props: { imageSource: null },
          check: () =>
            expect(screen.getByText('Black Winter Jacket')).toBeTruthy(),
        },
        {
          props: { reviewCount: undefined },
          check: () => expect(screen.queryByText('6,890')).toBeFalsy(),
        },
        {
          props: { currency: 'USD' as const },
          check: () => expect(screen.getByText('$ 499.00')).toBeTruthy(),
        },
        {
          props: { style: { marginTop: 20 } },
          check: () =>
            expect(screen.getByText('Black Winter Jacket')).toBeTruthy(),
        },
      ];

      testCases.forEach(({ props, check }) => {
        const { unmount } = renderProductCard(props);
        check();
        unmount();
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

    it('handles undefined onPress gracefully', () => {
      renderProductCard({ onPress: undefined });

      const productCard = screen.getByLabelText(
        'Product: Black Winter Jacket, Price: 499 INR, Rating: 5 stars',
      );
      fireEvent.press(productCard);

      // Should not throw error
      expect(productCard).toBeTruthy();
    });

    it('handles undefined onWishlistToggle gracefully', () => {
      renderProductCard({ onWishlistToggle: undefined, isWishlisted: true });

      // Should not render wishlist button
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(1);
    });

    it('handles wishlist states correctly', () => {
      const testCases = [
        {
          props: {},
          check: () => {
            expect(screen.queryByLabelText('Add to wishlist')).toBeFalsy();
            expect(screen.queryByLabelText('Remove from wishlist')).toBeFalsy();
          },
        },
        {
          props: { onWishlistToggle: jest.fn(), isWishlisted: true },
          check: () => {
            const wishlistButtons = screen.getAllByRole('button');
            expect(wishlistButtons.length).toBeGreaterThan(1);
          },
        },
        {
          props: { onWishlistToggle: jest.fn(), isWishlisted: false },
          check: () => {
            const wishlistButtons = screen.getAllByRole('button');
            expect(wishlistButtons.length).toBeGreaterThan(1);
          },
        },
      ];

      testCases.forEach(({ props, check }) => {
        const { unmount } = renderProductCard(props);
        check();
        unmount();
      });
    });
  });

  describe('Description Logic', () => {
    it('handles description fallback logic', () => {
      const testCases = [
        {
          props: { description: 'Custom description' },
          check: () =>
            expect(screen.getByText('Custom description')).toBeTruthy(),
        },
        {
          props: { description: undefined },
          check: () =>
            expect(
              screen.getByText('Winter Co. Black Winter Jacket'),
            ).toBeTruthy(),
        },
        {
          props: { description: undefined, brand: undefined },
          check: () =>
            expect(screen.getAllByText('Black Winter Jacket')).toHaveLength(2),
        },
        {
          props: { description: undefined, brand: 'Test Brand' },
          check: () =>
            expect(
              screen.getByText('Test Brand Black Winter Jacket'),
            ).toBeTruthy(),
        },
        {
          props: { description: '', brand: '' },
          check: () =>
            expect(screen.getAllByText('Black Winter Jacket')).toHaveLength(2),
        },
      ];

      testCases.forEach(({ props, check }) => {
        const { unmount } = renderProductCard(props);
        check();
        unmount();
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
    it('matches snapshot for different states', () => {
      const { toJSON: toJSON1 } = renderProductCard();
      expect(toJSON1()).toMatchSnapshot('complete-product');

      const { toJSON: toJSON2, unmount } = renderProductCard({
        onWishlistToggle: jest.fn(),
        isWishlisted: true,
      });
      expect(toJSON2()).toMatchSnapshot('with-wishlist');
      unmount();
    });
  });

  describe('Edge Cases', () => {
    it('handles edge cases for brand, rating, and review count', () => {
      const testCases = [
        {
          props: { brand: null as unknown as string },
          check: () =>
            expect(screen.getByText('Black Winter Jacket')).toBeTruthy(),
        },
        {
          props: { brand: '', description: undefined },
          check: () =>
            expect(
              screen.getAllByText('Black Winter Jacket').length,
            ).toBeGreaterThan(0),
        },
        {
          props: { rating: 0 },
          check: () =>
            expect(
              screen.getByLabelText(
                'Product: Black Winter Jacket, Price: 499 INR, Rating: 0 stars',
              ),
            ).toBeTruthy(),
        },
        {
          props: { reviewCount: 0 },
          check: () =>
            expect(screen.getByText('Black Winter Jacket')).toBeTruthy(),
        },
      ];

      testCases.forEach(({ props, check }) => {
        const { unmount } = renderProductCard(props);
        check();
        unmount();
      });
    });
  });
});
