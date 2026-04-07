import { render, fireEvent, screen } from '@testing-library/react-native';

// Component
import { PaymentMethodItem } from '@app/components/ui/PaymentMethodItem';

jest.mock('@app/icons', () => {
  const RN = require('react-native');

  return {
    VisaIcon: () => <RN.View accessibilityLabel="visa-icon" />,
  };
});

describe('<PaymentMethodItem />', () => {
  const { VisaIcon } = require('@app/icons');

  it('renders icon and label, matches snapshot', () => {
    const { toJSON } = render(
      <PaymentMethodItem Icon={VisaIcon} label="********2109" selected />,
    );

    expect(screen.getByLabelText('visa-icon')).toBeTruthy();
    expect(screen.getByText('********2109')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('triggers onPress', () => {
    const onPress = jest.fn();
    render(
      <PaymentMethodItem
        Icon={VisaIcon}
        label="********2109"
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByText('********2109').parent!);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
