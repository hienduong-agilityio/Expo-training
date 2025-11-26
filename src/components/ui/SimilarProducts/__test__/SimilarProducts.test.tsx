import { render, screen, fireEvent } from '@testing-library/react-native';

// Components
import { SimilarProducts } from '@app/components/ui/SimilarProducts';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';

// Types
import type { IProduct } from '@app/interfaces';

describe('SimilarProducts', () => {
  const mockCallbacks = {
    onViewSimilar: jest.fn(),
    onAddToCompare: jest.fn(),
    onProductPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrides = {}) =>
    render(
      <SimilarProducts
        products={MOCK_PRODUCTS.slice(0, 3) as IProduct[]}
        onViewSimilar={mockCallbacks.onViewSimilar}
        onAddToCompare={mockCallbacks.onAddToCompare}
        onProductPress={mockCallbacks.onProductPress}
        {...overrides}
      />,
    );

  describe('Rendering', () => {
    it('renders all UI elements correctly', () => {
      const { toJSON } = renderComponent();

      expect(screen.getByText('View Similar')).toBeTruthy();
      expect(screen.getByText('Add to Compare')).toBeTruthy();
      expect(screen.getByText('Similar To')).toBeTruthy();
      expect(screen.getByText('3+ Items')).toBeTruthy();
      expect(screen.getByText('Sort')).toBeTruthy();
      expect(screen.getByText('Filter')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('displays correct item count for different product counts', () => {
      const { rerender } = renderComponent({
        products: MOCK_PRODUCTS.slice(0, 5),
      });
      expect(screen.getByText('5+ Items')).toBeTruthy();

      rerender(
        <SimilarProducts
          products={[]}
          onViewSimilar={mockCallbacks.onViewSimilar}
          onAddToCompare={mockCallbacks.onAddToCompare}
          onProductPress={mockCallbacks.onProductPress}
        />,
      );
      expect(screen.getByText('0+ Items')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('calls callbacks when buttons are pressed', () => {
      renderComponent();

      fireEvent.press(screen.getByText('View Similar'));
      expect(mockCallbacks.onViewSimilar).toHaveBeenCalledTimes(1);

      fireEvent.press(screen.getByText('Add to Compare'));
      expect(mockCallbacks.onAddToCompare).toHaveBeenCalledTimes(1);

      fireEvent.press(
        screen.getByLabelText(
          'Product: Black Winter Jacket, Price: 499 INR, Rating: 5 stars',
        ),
      );
      expect(mockCallbacks.onProductPress).toHaveBeenCalledWith('1');
    });

    it('handles undefined callbacks gracefully', () => {
      renderComponent({
        onViewSimilar: undefined,
        onAddToCompare: undefined,
        onProductPress: undefined,
      });

      expect(screen.getByText('View Similar')).toBeTruthy();
      expect(screen.getByText('Add to Compare')).toBeTruthy();
    });
  });
});
