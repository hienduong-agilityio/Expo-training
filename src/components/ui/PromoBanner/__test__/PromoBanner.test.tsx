import { render, fireEvent, screen } from '@testing-library/react-native';
import { View } from 'react-native';

// Component
import { PromoBanner } from '../index';

// Themes
import { colors } from '@app/themes';

// Constants
import { MESSAGES } from '@app/constants';

jest.mock('@app/icons', () => ({
  RightArrowIcon: () => {
    const RN = require('react-native');
    return <RN.View accessibilityLabel="arrow-icon" />;
  },
}));

describe('<PromoBanner />', () => {
  const MockIcon = () => <View accessibilityLabel="mock-icon" />;

  const renderBanner = (overrides = {}) =>
    render(
      <PromoBanner
        title="Deal of the Day"
        label="22h 55m 20s remaining"
        Icon={MockIcon}
        customStyle={{ container: { backgroundColor: colors.secondary } }}
        {...overrides}
      />,
    );

  it('matches snapshot (Blue)', () => {
    const { toJSON } = renderBanner({ onPressViewAll: jest.fn() });

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders title, label and icon', () => {
    renderBanner();

    expect(screen.getByText('Deal of the Day')).toBeTruthy();
    expect(screen.getByText('22h 55m 20s remaining')).toBeTruthy();
    expect(screen.getByLabelText('mock-icon')).toBeTruthy();
  });

  it('renders action and triggers onPress', () => {
    const onPressViewAll = jest.fn();
    renderBanner({ onPressViewAll });

    fireEvent.press(screen.getByText(MESSAGES.VIEW_ALL));
    expect(onPressViewAll).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('arrow-icon')).toBeTruthy();
  });

  it('hides action arrow when showActionArrow=false', () => {
    renderBanner({ onPressViewAll: jest.fn(), showActionArrow: false });

    expect(screen.getByText(MESSAGES.VIEW_ALL)).toBeTruthy();
    expect(screen.queryByLabelText('arrow-icon')).toBeNull();
  });

  it('does not render action when onPressViewAll is not provided', () => {
    renderBanner({ onPressViewAll: undefined });

    expect(screen.queryByText(MESSAGES.VIEW_ALL)).toBeNull();
  });
});
