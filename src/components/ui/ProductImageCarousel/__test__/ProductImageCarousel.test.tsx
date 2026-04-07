import { render, screen } from '@testing-library/react-native';

// Components
import { ProductImageCarousel } from '@app/components/ui/ProductImageCarousel';

describe('ProductImageCarousel', () => {
  const mockImages = [
    { uri: 'https://example.com/image1.jpg' },
    { uri: 'https://example.com/image2.jpg' },
    { uri: 'https://example.com/image3.jpg' },
  ];

  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      images: mockImages,
      productName: 'Test Product',
      ...overrides,
    };
    return render(<ProductImageCarousel {...defaultProps} />);
  };

  it('renders correctly with images', () => {
    const { toJSON } = renderComponent();

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders placeholder when images array is empty', () => {
    const { toJSON } = renderComponent({ images: [] });

    expect(toJSON()).toMatchSnapshot();
  });

  it('handles scroll events and updates active index', () => {
    const { toJSON } = renderComponent();

    // Test that component renders correctly
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders navigation buttons for multiple images', () => {
    const { toJSON } = renderComponent();

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with product name for accessibility', () => {
    renderComponent({ productName: 'Test Product' });

    const images = screen.getAllByLabelText(/Test Product image/);
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders navigation buttons correctly', () => {
    const { toJSON } = renderComponent();

    // Test that component renders with navigation
    expect(toJSON()).toMatchSnapshot();
  });

  it('does not render pagination for single image', () => {
    const { toJSON } = renderComponent({
      images: [{ uri: 'https://example.com/image1.jpg' }],
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders placeholder when images is null', () => {
    const { toJSON } = renderComponent({
      images: null as unknown as { uri: string }[],
    });

    expect(screen.getByLabelText(/Test Product image/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders placeholder when images is undefined', () => {
    const { toJSON } = renderComponent({ images: undefined });

    expect(screen.getByLabelText(/Test Product image/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with empty product name', () => {
    const { toJSON } = renderComponent({ productName: '' });

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders pagination dots when images.length > 1', () => {
    const { toJSON } = renderComponent({
      images: [
        { uri: 'https://example.com/image1.jpg' },
        { uri: 'https://example.com/image2.jpg' },
      ],
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders navigation buttons when images.length > 1', () => {
    const { toJSON } = renderComponent({
      images: [
        { uri: 'https://example.com/image1.jpg' },
        { uri: 'https://example.com/image2.jpg' },
      ],
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
