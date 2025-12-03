import { render, screen } from '@testing-library/react-native';

// Components
import { CartItem } from '@app/components/ui/CartItem';

// Mocks
import { MOCK_IMAGE_SOURCES } from '@app/mocks/images';

describe('CartItem', () => {
  const mockProps = {
    id: '1',
    name: 'Test Product',
    imageSource: MOCK_IMAGE_SOURCES.valid,
    quantity: 2,
    price: 1500,
  };

  it('renders product info and quantity', () => {
    const { toJSON } = render(
      <CartItem
        title="Test Product"
        slug="test-product"
        deals={[]}
        trendings={[]}
        createdAt="2021-01-01"
        updatedAt="2021-01-01"
        {...mockProps}
      />,
    );

    expect(screen.getByLabelText('Cart item')).toBeTruthy();
    expect(screen.getByLabelText('Product name: Test Product')).toBeTruthy();
    expect(screen.getByLabelText('Quantity value 2')).toBeTruthy();
    expect(screen.getByText('₹ 3000.00')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });
});
