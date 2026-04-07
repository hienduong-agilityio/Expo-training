import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { LoadingButton } from '@app/components/common/LoadingButton';

describe('LoadingButton', () => {
  describe('Rendering', () => {
    it('renders loading button with default label', () => {
      const { toJSON } = render(
        <LoadingButton label="Submit" onPress={() => {}} />,
      );

      expect(screen.getByText('Submit')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders loading button with custom loading label', () => {
      const { toJSON } = render(
        <LoadingButton
          label="Submit"
          loadingLabel="Submitting..."
          loading
          onPress={() => {}}
        />,
      );

      expect(screen.getByText('Submitting...')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Interactions', () => {
    it('handles press event when not loading', () => {
      const onPress = jest.fn();
      render(<LoadingButton label="Press Me" onPress={onPress} />);

      const button = screen.getByText('Press Me');
      fireEvent.press(button);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not handle press event when loading', () => {
      const onPress = jest.fn();
      render(<LoadingButton label="Loading" loading onPress={onPress} />);

      const button = screen.getByText('Loading...');
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not handle press event when disabled', () => {
      const onPress = jest.fn();
      render(<LoadingButton label="Disabled" disabled onPress={onPress} />);

      const button = screen.getByText('Disabled');
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('renders disabled state', () => {
      const { toJSON } = render(
        <LoadingButton label="Disabled" disabled onPress={() => {}} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('renders full width button', () => {
      const { toJSON } = render(
        <LoadingButton label="Full Width" fullWidth onPress={() => {}} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('renders different sizes', () => {
      const { toJSON: small } = render(
        <LoadingButton label="Small" size="sm" onPress={() => {}} />,
      );
      const { toJSON: medium } = render(
        <LoadingButton label="Medium" size="md" onPress={() => {}} />,
      );
      const { toJSON: large } = render(
        <LoadingButton label="Large" size="lg" onPress={() => {}} />,
      );

      expect(small()).toMatchSnapshot();
      expect(medium()).toMatchSnapshot();
      expect(large()).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    it('shows loading label when loading', () => {
      render(
        <LoadingButton
          label="Submit"
          loadingLabel="Processing..."
          loading
          onPress={() => {}}
        />,
      );

      expect(screen.getByText('Processing...')).toBeTruthy();
      expect(screen.queryByText('Submit')).toBeFalsy();
    });

    it('shows label when not loading', () => {
      render(<LoadingButton label="Submit" onPress={() => {}} />);

      expect(screen.getByText('Submit')).toBeTruthy();
      expect(screen.queryByText('Loading...')).toBeFalsy();
    });

    it('is disabled when loading is true', () => {
      render(<LoadingButton label="Submit" loading onPress={() => {}} />);

      const button = screen.getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
      expect(button.props.accessibilityState?.busy).toBe(true);
    });

    it('is disabled when disabled is true', () => {
      render(<LoadingButton label="Submit" disabled onPress={() => {}} />);

      const button = screen.getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('is disabled when both loading and disabled are true', () => {
      render(
        <LoadingButton label="Submit" loading disabled onPress={() => {}} />,
      );

      const button = screen.getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
      expect(button.props.accessibilityState?.busy).toBe(true);
    });

    it('shows default loading label when loadingLabel is not provided', () => {
      render(<LoadingButton label="Submit" loading onPress={() => {}} />);

      expect(screen.getByText('Loading...')).toBeTruthy();
    });
  });
});
