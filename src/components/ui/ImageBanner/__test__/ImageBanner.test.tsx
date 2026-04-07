import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { ImageBanner } from '@app/components/ui/ImageBanner';

// Constants
import { PROMO_BANNER } from '@app/mocks/banners';

describe('ImageBanner', () => {
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      banner: PROMO_BANNER,
      ...overrides,
    };
    return render(<ImageBanner {...defaultProps} />);
  };

  it('renders correctly with banner data', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText(PROMO_BANNER.title)).toBeTruthy();
    expect(screen.getByText(PROMO_BANNER.subtitle)).toBeTruthy();
    expect(screen.getByText(PROMO_BANNER.description)).toBeTruthy();
    expect(screen.getByText(PROMO_BANNER.ctaText)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onPress when CTA button is pressed', () => {
    const onPress = jest.fn();
    renderComponent({ onPress });

    fireEvent.press(screen.getByText(PROMO_BANNER.ctaText));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
