import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProductAlerts } from '../useProductAlerts';
import { IProduct } from '@app/interfaces/product';

jest.mock('@app/constants', () => ({
  PRODUCT_MESSAGES: {
    PRODUCT_DETAILS: 'Product Details',
    NO_DETAILS_AVAILABLE: 'No details available',
    VIEW_SIMILAR: 'View Similar',
    VIEW_SIMILAR_DESCRIPTION: 'Showing similar products',
    ADD_TO_COMPARE: 'Add to Compare',
    ADD_TO_COMPARE_DESCRIPTION: 'Product added to comparison',
  },
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useProductAlerts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    currency: 'USD',
    imageSource: { uri: 'test-image' },
    rating: 4.5,
    reviewCount: 10,
  } as unknown as IProduct;

  it('shows product details when showDetails is called', () => {
    const { result } = renderHook(() => useProductAlerts());

    act(() => {
      result.current.showDetails(mockProduct);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Product Details',
      mockProduct.description,
    );
  });

  it('shows fallback message when product description is missing', () => {
    const { result } = renderHook(() => useProductAlerts());
    const productWithoutDesc = { ...mockProduct, description: '' };

    act(() => {
      result.current.showDetails(productWithoutDesc);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Product Details',
      'No details available',
    );
  });

  it('shows similar products alert', () => {
    const { result } = renderHook(() => useProductAlerts());

    act(() => {
      result.current.showSimilar();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'View Similar',
      'Showing similar products',
    );
  });

  it('shows compare products alert', () => {
    const { result } = renderHook(() => useProductAlerts());

    act(() => {
      result.current.showCompare();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Add to Compare',
      'Product added to comparison',
    );
  });
});
