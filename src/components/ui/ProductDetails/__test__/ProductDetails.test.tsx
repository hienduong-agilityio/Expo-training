import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { ProductDetails } from '@app/components/ui/ProductDetails';

// Mocks
import { MOCK_SIZES } from '@app/mocks/products';
import { IProductDetailsProps, IProductSize } from '@app/interfaces/product';

describe('ProductDetails', () => {
  const baseProps = {
    id: '1',
    name: 'Test Product',
    price: 100,
    currency: 'USD' as const,
    sizes: MOCK_SIZES,
    features: [],
    onShowMoreDetails: jest.fn(),
  };

  const renderComponent = (overrides = {}) => {
    return render(
      <ProductDetails
        {...(baseProps as unknown as IProductDetailsProps)}
        {...overrides}
      />,
    );
  };

  describe('Basic rendering', () => {
    it('renders correctly with basic props', () => {
      const { toJSON } = renderComponent();

      expect(screen.getByText('Test Product')).toBeTruthy();
      expect(screen.getByText('$ 100.00')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders with all optional props', () => {
      const onShowMoreDetails = jest.fn();
      const { toJSON } = renderComponent({
        shortDescription: 'A great product',
        rating: 4.5,
        reviewCount: 1234,
        originalPrice: 150,
        discountPercent: 33,
        details: 'Product details text',
        onShowMoreDetails,
      });

      expect(screen.getByText('A great product')).toBeTruthy();
      expect(screen.getByText('1,234')).toBeTruthy();
      expect(screen.getByText('$ 150.00')).toBeTruthy();
      expect(screen.getByText('33% Off')).toBeTruthy();
      expect(screen.getByText('Product details text')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Rating and reviews', () => {
    it('renders rating with review count', () => {
      renderComponent({ rating: 4.5, reviewCount: 1234 });
      expect(screen.getByText('1,234')).toBeTruthy();
    });

    it('does not render rating section when rating is undefined', () => {
      renderComponent({ rating: undefined });
      expect(screen.queryByLabelText('stars')).toBeNull();
    });

    it('renders rating without review count', () => {
      renderComponent({ rating: 4.5, reviewCount: undefined });
      expect(screen.getByText('Test Product')).toBeTruthy();
    });
  });

  describe('Price and discount', () => {
    it('renders with original price and discount', () => {
      renderComponent({ originalPrice: 150, discountPercent: 33 });
      expect(screen.getByText('$ 150.00')).toBeTruthy();
      expect(screen.getByText('33% Off')).toBeTruthy();
    });

    it('does not render original price when not provided or <= current price', () => {
      const { rerender } = renderComponent({ price: 100 });
      expect(screen.getByText('$ 100.00')).toBeTruthy();

      rerender(
        <ProductDetails
          {...(baseProps as unknown as IProductDetailsProps)}
          price={100}
          originalPrice={100}
          sizes={MOCK_SIZES as unknown as IProductSize[]}
          features={[]}
          onShowMoreDetails={jest.fn()}
        />,
      );
      expect(screen.getByText('$ 100.00')).toBeTruthy();
    });

    it('does not render discount badge when discountPercent is 0 or undefined', () => {
      const { rerender } = renderComponent({
        price: 100,
        originalPrice: 100,
        discountPercent: 0,
      });
      expect(screen.queryByText('% Off')).toBeNull();

      rerender(
        <ProductDetails
          {...(baseProps as unknown as IProductDetailsProps)}
          price={80}
          originalPrice={100}
          discountPercent={undefined}
          features={[]}
          onShowMoreDetails={jest.fn()}
        />,
      );
      expect(screen.queryByText('% Off')).toBeNull();
    });
  });

  describe('Details section', () => {
    it('renders details and handles onShowMoreDetails', () => {
      const onShowMoreDetails = jest.fn();
      renderComponent({
        details: 'Product details text',
        onShowMoreDetails,
      });

      fireEvent.press(screen.getByText('More'));
      expect(onShowMoreDetails).toHaveBeenCalledTimes(1);
    });

    it('does not render details section when details is not provided or empty', () => {
      const { rerender } = renderComponent();
      expect(screen.queryByText('More')).toBeNull();

      rerender(
        <ProductDetails
          {...(baseProps as unknown as IProductDetailsProps)}
          details=""
          features={[]}
          onShowMoreDetails={jest.fn()}
        />,
      );
      expect(screen.queryByText('More')).toBeNull();
    });
  });
});
