import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { SponsoredBanner } from '@app/components/ui/SponsoredBanner';

// Constants
import { SPONSORED_BANNER } from '@app/constants/banner';

describe('SponsoredBanner', () => {
  it('renders correctly with banner data', () => {
    const { toJSON } = render(<SponsoredBanner banner={SPONSORED_BANNER} />);

    expect(screen.getByText('Sponsored')).toBeTruthy();
    expect(screen.getByText(SPONSORED_BANNER.footerText)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onPress when footer is pressed', () => {
    const onPress = jest.fn();
    render(<SponsoredBanner banner={SPONSORED_BANNER} onPress={onPress} />);

    fireEvent.press(screen.getByText(SPONSORED_BANNER.footerText));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
