import { render, screen } from '@testing-library/react-native';

// Components
import { ProductSection } from '@app/components/ui/ProductSection';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';

describe('ProductSection', () => {
  const baseProps = {
    title: 'Featured Products',
    subtitle: 'Best deals',
    products: MOCK_PRODUCTS.slice(0, 3),
    loading: false,
    error: null,
  };

  const renderComponent = (overrides = {}) => {
    return render(<ProductSection {...baseProps} {...overrides} />);
  };

  it('renders correctly with products', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText('Featured Products')).toBeTruthy();
    expect(screen.getByText('Best deals')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders loading state', () => {
    const { toJSON } = renderComponent({ loading: true });

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders error state', () => {
    const { toJSON } = renderComponent({
      error: new Error('Failed to load'),
    });

    expect(screen.getByText(/Error:/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with custom action label', () => {
    const { toJSON } = renderComponent({ actionLabel: 'See More' });

    // PromoBanner should render with custom action label
    expect(toJSON()).toMatchSnapshot();
  });
});
