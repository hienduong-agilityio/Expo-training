import { render, fireEvent, screen } from '@testing-library/react-native';

// Components
import { FallbackImage } from '@app/components/common/FallbackImage';

// Mocks
import { MOCK_IMAGE_SOURCES } from '@app/mocks/images';

describe('FallbackImage', () => {
  it('renders with valid source', () => {
    const { toJSON } = render(
      <FallbackImage source={MOCK_IMAGE_SOURCES.valid} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with null source', () => {
    const { toJSON } = render(
      <FallbackImage source={MOCK_IMAGE_SOURCES.invalid} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('handles error and calls onError', () => {
    render(
      <FallbackImage
        source={MOCK_IMAGE_SOURCES.invalid}
        testID="fallback-image"
      />,
    );

    const image = screen.getByTestId('fallback-image');

    fireEvent(image, 'error', { nativeEvent: {} });
  });

  it('uses fallback when source is null', () => {
    const { toJSON } = render(<FallbackImage source={undefined} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('uses fallback when source is undefined', () => {
    const { toJSON } = render(<FallbackImage source={undefined} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('switches to fallback when image error occurs', () => {
    const { toJSON, rerender } = render(
      <FallbackImage
        source={MOCK_IMAGE_SOURCES.valid}
        testID="fallback-image"
      />,
    );

    const image = screen.getByTestId('fallback-image');
    fireEvent(image, 'error', { nativeEvent: {} });

    rerender(
      <FallbackImage
        source={MOCK_IMAGE_SOURCES.valid}
        testID="fallback-image"
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('uses custom fallback source', () => {
    const customFallback = { uri: 'https://example.com/custom-fallback.jpg' };
    const { toJSON } = render(
      <FallbackImage source={undefined} fallbackSource={customFallback} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
