import { render, screen } from '@testing-library/react-native';

// Components
import { SectionContent } from '../SectionContent';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';
import { IProductCardProps } from '@app/interfaces';

describe('SectionContent', () => {
  const baseProps = {
    products: MOCK_PRODUCTS.slice(0, 3),
    loading: false,
    error: null,
    onItemPress: jest.fn(),
  };

  const renderComponent = (overrides = {}) => {
    return render(
      <SectionContent
        {...baseProps}
        {...overrides}
        products={baseProps.products as unknown as IProductCardProps[]}
      />,
    );
  };

  it('renders products when not loading and no error', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders loading state', () => {
    const { toJSON } = renderComponent({ loading: true });

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders error state with error message', () => {
    const error = new Error('Failed to load products');
    const { toJSON } = renderComponent({ error });

    expect(screen.getByText(/Error: Failed to load products/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders error state without error message', () => {
    const error = new Error('');
    const { toJSON } = renderComponent({ error });

    expect(screen.getByText(/Error: Failed to load products/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders error state with null error message', () => {
    const error = { message: null } as unknown as Error;
    const { toJSON } = renderComponent({ error });

    expect(screen.getByText(/Error: Failed to load products/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders empty products list', () => {
    const { toJSON } = renderComponent({ products: [] });

    expect(toJSON()).toMatchSnapshot();
  });
});
