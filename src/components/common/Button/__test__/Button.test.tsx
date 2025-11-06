import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { Button } from '@app/components/common/Button';

// Enums
import { BUTTON_VARIANTS, BUTTON_COLORS } from '@app/enums';

// Types
import type { IButtonProps } from '@app/interfaces';

describe('Button', () => {
  const renderButton = (overrides = {}) => {
    const defaultProps = {
      label: 'Test Button',
      ...overrides,
    };
    return render(<Button {...defaultProps} />);
  };

  const testButtonVariants = (
    variants: Array<{
      name: string;
      props: Partial<IButtonProps>;
      expectedText?: string;
    }>,
  ) => {
    for (const { name, props, expectedText } of variants) {
      it(`renders ${name} button correctly`, () => {
        const { toJSON } = renderButton(props);

        if (expectedText) {
          expect(screen.getByText(expectedText)).toBeTruthy();
        }
        expect(toJSON()).toMatchSnapshot(name);
      });
    }
  };

  const testButtonInteraction = (
    variant: string,
    expectedBehavior = 'calls onPress',
  ) => {
    it(`${expectedBehavior} for ${variant} button`, () => {
      const onPress = jest.fn();
      const { toJSON } = renderButton({
        label: 'Press Me',
        variant,
        onPress,
      });

      const button = screen.getByRole('button');
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(1);
      expect(toJSON()).toMatchSnapshot(`${variant}-interaction`);
    });
  };

  describe('Basic Rendering', () => {
    it('renders button with default props', () => {
      const { toJSON } = renderButton();

      expect(screen.getByText('Test Button')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot('default');
    });

    it('renders different button sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      for (const size of sizes) {
        const { toJSON } = renderButton({
          label: `${size.toUpperCase()} Button`,
          size,
        });
        expect(toJSON()).toMatchSnapshot(`${size}-size`);
      }
    });
  });

  describe('Button Variants', () => {
    const variantTestCases = [
      {
        name: 'solid primary',
        props: {
          label: 'Solid Primary',
          variant: BUTTON_VARIANTS.SOLID,
          color: BUTTON_COLORS.PRIMARY,
        },
        expectedText: 'Solid Primary',
      },
      {
        name: 'outline primary',
        props: {
          label: 'Outline Primary',
          variant: BUTTON_VARIANTS.OUTLINE,
          color: BUTTON_COLORS.PRIMARY,
        },
        expectedText: 'Outline Primary',
      },
      {
        name: 'outline neutral',
        props: {
          label: 'Outline Neutral',
          variant: BUTTON_VARIANTS.OUTLINE,
          color: BUTTON_COLORS.NEUTRAL,
        },
        expectedText: 'Outline Neutral',
      },
      {
        name: 'solid neutral',
        props: {
          label: 'Solid Neutral',
          variant: BUTTON_VARIANTS.SOLID,
          color: BUTTON_COLORS.NEUTRAL,
        },
        expectedText: 'Solid Neutral',
      },
    ];

    testButtonVariants(variantTestCases);
  });

  describe('Button States', () => {
    const stateTestCases = [
      {
        name: 'selected outline button (renders as solid)',
        props: {
          label: 'Selected Outline',
          variant: BUTTON_VARIANTS.OUTLINE,
          color: BUTTON_COLORS.PRIMARY,
          selected: true,
        },
        expectedText: 'Selected Outline',
      },
      {
        name: 'disabled button',
        props: {
          label: 'Disabled',
          disabled: true,
        },
        expectedText: 'Disabled',
      },
      {
        name: 'full width button',
        props: {
          label: 'Full Width',
          fullWidth: true,
        },
        expectedText: 'Full Width',
      },
    ];

    testButtonVariants(stateTestCases);
  });

  describe('Button Interactions', () => {
    it('handles basic press event', () => {
      const onPress = jest.fn();
      renderButton({ label: 'Tap Me', onPress });

      const button = screen.getByText('Tap Me');
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    testButtonInteraction(BUTTON_VARIANTS.SOLID);
    testButtonInteraction(BUTTON_VARIANTS.OUTLINE);

    it('handles complete press lifecycle (pressIn -> press -> pressOut)', () => {
      const onPress = jest.fn();
      renderButton({
        label: 'Press Me',
        variant: BUTTON_VARIANTS.SOLID,
        onPress,
      });

      const button = screen.getByRole('button');

      fireEvent(button, 'pressIn');
      fireEvent.press(button);
      fireEvent(button, 'pressOut');

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when button is disabled', () => {
      const onPress = jest.fn();
      renderButton({
        label: 'Disabled',
        disabled: true,
        onPress,
      });

      const button = screen.getByText('Disabled');
      fireEvent.press(button);

      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility attributes', () => {
      renderButton({ label: 'Accessible Button' });

      const button = screen.getByRole('button');
      expect(button).toBeTruthy();
      expect(screen.getByText('Accessible Button')).toBeTruthy();
    });
  });
});
