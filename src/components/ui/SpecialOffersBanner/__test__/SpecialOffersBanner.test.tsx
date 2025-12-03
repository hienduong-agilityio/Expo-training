import { render, screen } from '@testing-library/react-native';

// Components
import { SpecialOffersBanner } from '@app/components/ui/SpecialOffersBanner';

// Constants
import { SPECIAL_OFFERS_BANNER } from '@app/mocks/banners';

describe('SpecialOffersBanner', () => {
  it('renders correctly with banner data', () => {
    const { toJSON } = render(
      <SpecialOffersBanner banner={SPECIAL_OFFERS_BANNER} />,
    );

    expect(screen.getByText(SPECIAL_OFFERS_BANNER.title)).toBeTruthy();
    expect(screen.getByText(SPECIAL_OFFERS_BANNER.description)).toBeTruthy();
    expect(screen.getByText('😱')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
