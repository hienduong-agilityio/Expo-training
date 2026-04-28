import { render, fireEvent, screen } from '@testing-library/react-native';

// Component
import { PaymentMethods } from '@app/components/ui/PaymentMethods';

jest.mock('@app/icons', () => {
  const RN = require('react-native');
  return {
    VisaIcon: () => <RN.View accessibilityLabel="visa-icon" />,
    PaypalIcon: () => <RN.View accessibilityLabel="paypal-icon" />,
    MaestroIcon: () => <RN.View accessibilityLabel="maestro-icon" />,
    AppleIcon: () => <RN.View accessibilityLabel="apple-icon" />,
  };
});

describe('<PaymentMethods />', () => {
  const baseProps = {
    title: 'Payment',
    options: [
      { id: 'visa', maskedCardNumber: '************2109' },
      { id: 'paypal', maskedCardNumber: '************2109' },
      { id: 'maestro', maskedCardNumber: '************2109' },
      { id: 'apple', maskedCardNumber: '************2109' },
    ] as const,
    selectedId: 'visa' as const,
  };

  it('renders title, options and continue button', () => {
    const { toJSON } = render(
      <PaymentMethods {...{ ...baseProps, options: [...baseProps.options] }} />,
    );

    expect(screen.getByText('Payment')).toBeTruthy();
    expect(screen.getByLabelText('payment-option-visa')).toBeTruthy();
    expect(screen.getByLabelText('payment-option-paypal')).toBeTruthy();
    expect(screen.getByLabelText('payment-option-maestro')).toBeTruthy();
    expect(screen.getByLabelText('payment-option-apple')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('fires onSelect and onContinue', () => {
    const onSelect = jest.fn();
    const onContinue = jest.fn();

    render(
      <PaymentMethods
        {...{ ...baseProps, options: [...baseProps.options] }}
        onSelect={onSelect}
        onContinue={onContinue}
      />,
    );

    fireEvent.press(screen.getByLabelText('payment-option-paypal'));
    fireEvent.press(screen.getByText('Continue'));

    expect(onSelect).toHaveBeenCalledWith('paypal');
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('handles undefined onSelect gracefully', () => {
    const { toJSON } = render(
      <PaymentMethods
        {...{ ...baseProps, options: [...baseProps.options] }}
        onSelect={undefined}
      />,
    );

    const paymentOption = screen.getByLabelText('payment-option-visa');
    fireEvent.press(paymentOption);

    // Should not throw error
    expect(toJSON()).toMatchSnapshot();
  });

  it('handles undefined onContinue gracefully', () => {
    const { toJSON } = render(
      <PaymentMethods
        {...{ ...baseProps, options: [...baseProps.options] }}
        onContinue={undefined}
      />,
    );

    const continueButton = screen.getByText('Continue');
    fireEvent.press(continueButton);

    // Should not throw error
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with no selected option', () => {
    const { toJSON } = render(
      <PaymentMethods
        {...{ ...baseProps, options: [...baseProps.options] }}
        selectedId={undefined}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
