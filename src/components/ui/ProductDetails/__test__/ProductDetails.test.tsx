import { render, fireEvent, screen } from '@testing-library/react-native';
import { ProductDetails } from '../index';
import type { IProductDetailsProps } from '@app/interfaces';

describe('ProductDetails', () => {
  const mockProduct: IProductDetailsProps = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 1000,
    originalPrice: 1500,
    discountPercent: 33,
    currency: 'INR',
    rating: 4.5,
    reviewCount: 1234,
    details: 'Product details here',
    images: [],
    sizes: [],
    features: [],
    onShowMoreDetails: jest.fn(),
  };

  const mockProps = {
    ...mockProduct,
    onShowMoreDetails: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information', () => {
    render(<ProductDetails {...mockProps} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('Test description')).toBeTruthy();
    expect(screen.getByText('Product Details')).toBeTruthy();
    expect(screen.getByText('More')).toBeTruthy();
  });

  it('shows original price when discount exists', () => {
    render(<ProductDetails {...mockProps} />);

    expect(screen.getByText('₹ 1500')).toBeTruthy();
    expect(screen.getByText('33% Off')).toBeTruthy();
  });

  it('does not show original price when no discount', () => {
    const productWithoutDiscount = {
      ...mockProduct,
      originalPrice: undefined,
      discountPercent: undefined,
    };

    render(<ProductDetails {...mockProps} {...productWithoutDiscount} />);

    expect(screen.queryByText('₹ 1500')).toBeNull();
    expect(screen.queryByText('33% Off')).toBeNull();
  });

  it('calls onShowMoreDetails when More is pressed', () => {
    render(<ProductDetails {...mockProps} />);

    fireEvent.press(screen.getByText('More'));
    expect(mockProps.onShowMoreDetails).toHaveBeenCalledTimes(1);
  });

  it('handles product without details', () => {
    const productWithoutDetails = {
      ...mockProduct,
      details: '',
    };

    render(<ProductDetails {...mockProps} {...productWithoutDetails} />);

    expect(screen.getByText('Product Details')).toBeTruthy();
  });

  it('formats review count correctly', () => {
    render(<ProductDetails {...mockProps} />);

    expect(screen.getByText('1,234')).toBeTruthy();
  });

  it('uses default currency when not provided', () => {
    const productWithoutCurrency = {
      ...mockProduct,
      currency: undefined,
    };

    render(<ProductDetails {...mockProps} {...productWithoutCurrency} />);

    expect(screen.getByText('₹ 1000')).toBeTruthy();
  });
});
