import { render, fireEvent, screen } from '@testing-library/react-native';

// Component
import { SocialAuthButtons } from '@app/components/ui/SocialAuthButtons';

jest.mock('@app/icons', () => {
  const RN = require('react-native');
  return {
    GoogleIcon: () => <RN.View accessibilityLabel="google-icon" />,
    AppleIcon: () => <RN.View accessibilityLabel="apple-icon" />,
    FacebookIcon: () => <RN.View accessibilityLabel="facebook-icon" />,
  };
});

describe('<SocialAuthButtons />', () => {
  const defaultProps = {
    onSelect: jest.fn(),
  };

  const renderSocialAuthButtons = (overrides = {}) => {
    return render(<SocialAuthButtons {...defaultProps} {...overrides} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders three provider buttons', () => {
    const { toJSON } = renderSocialAuthButtons();

    expect(screen.getByLabelText('google-icon')).toBeTruthy();
    expect(screen.getByLabelText('apple-icon')).toBeTruthy();
    expect(screen.getByLabelText('facebook-icon')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onSelect with correct provider when pressed', () => {
    const onSelect = jest.fn();
    renderSocialAuthButtons({ onSelect });

    fireEvent.press(screen.getByLabelText('google-icon').parent!);
    fireEvent.press(screen.getByLabelText('apple-icon').parent!);
    fireEvent.press(screen.getByLabelText('facebook-icon').parent!);

    expect(onSelect).toHaveBeenNthCalledWith(1, 'google');
    expect(onSelect).toHaveBeenNthCalledWith(2, 'apple');
    expect(onSelect).toHaveBeenNthCalledWith(3, 'facebook');
  });
});
