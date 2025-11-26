import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { ProductActions } from '@app/components/ui/ProductActions';

describe('ProductActions', () => {
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      onAddToCart: jest.fn(),
      onBuyNow: jest.fn(),
      ...overrides,
    };
    return render(<ProductActions {...defaultProps} />);
  };

  it('renders correctly with default props', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText('Go to cart')).toBeTruthy();
    expect(screen.getByText('Buy Now')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onAddToCart when add to cart button is pressed', () => {
    const onAddToCart = jest.fn();
    renderComponent({ onAddToCart });

    fireEvent.press(screen.getByText('Go to cart'));

    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it('calls onBuyNow when buy now button is pressed', () => {
    const onBuyNow = jest.fn();
    renderComponent({ onBuyNow });

    fireEvent.press(screen.getByText('Buy Now'));

    expect(onBuyNow).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when loading', () => {
    const onAddToCart = jest.fn();
    const onBuyNow = jest.fn();
    renderComponent({
      onAddToCart,
      onBuyNow,
      addToCartLoading: true,
    });

    fireEvent.press(screen.getByText('Go to cart'));
    fireEvent.press(screen.getByText('Buy Now'));

    expect(onAddToCart).not.toHaveBeenCalled();
    expect(onBuyNow).not.toHaveBeenCalled();
  });
});
