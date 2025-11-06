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
});
