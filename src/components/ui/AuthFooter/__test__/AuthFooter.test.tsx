import { render, fireEvent, screen } from '@testing-library/react-native';

// Component
import { AuthFooter } from '@app/components/ui/AuthFooter';

jest.mock('@app/icons', () => {
  const RN = require('react-native');

  return {
    GoogleIcon: () => <RN.View accessibilityLabel="google-icon" />,
    AppleIcon: () => <RN.View accessibilityLabel="apple-icon" />,
    FacebookIcon: () => <RN.View accessibilityLabel="facebook-icon" />,
  };
});

describe('<AuthFooter />', () => {
  const defaultProps = {
    helperText: "Don't have an account?",
    helperActionLabel: 'Sign up',
    onHelperActionPress: jest.fn(),
    onSocialSelect: jest.fn(),
  };

  const renderFooter = (overrides = {}) =>
    render(<AuthFooter {...defaultProps} {...overrides} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders divider, social icons and helper navigation', () => {
    const { toJSON } = renderFooter();

    expect(screen.getByText('- OR continue with -')).toBeTruthy();
    expect(screen.getByLabelText('google-icon')).toBeTruthy();
    expect(screen.getByLabelText('apple-icon')).toBeTruthy();
    expect(screen.getByLabelText('facebook-icon')).toBeTruthy();
    expect(screen.getByText(defaultProps.helperText)).toBeTruthy();
    expect(screen.getByText(defaultProps.helperActionLabel)).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onHelperActionPress when helper link is pressed', () => {
    renderFooter();

    fireEvent.press(screen.getByText(defaultProps.helperActionLabel).parent!);
    expect(defaultProps.onHelperActionPress).toHaveBeenCalledTimes(1);
  });

  it('forwards social select events', () => {
    renderFooter();

    fireEvent.press(screen.getByLabelText('google-icon').parent!);
    fireEvent.press(screen.getByLabelText('apple-icon').parent!);
    fireEvent.press(screen.getByLabelText('facebook-icon').parent!);

    expect(defaultProps.onSocialSelect).toHaveBeenCalledTimes(3);
  });
});
