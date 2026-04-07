import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { Quantity } from '@app/components/ui/Quantity';

describe('Quantity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderQuantity = (props: React.ComponentProps<typeof Quantity>) => {
    return render(<Quantity {...props} />);
  };

  it('renders current value and buttons', () => {
    const { toJSON } = renderQuantity({ value: 2 });

    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByLabelText('Decrease quantity')).toBeTruthy();
    expect(screen.getByLabelText('Increase quantity')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('calls callbacks when pressing buttons', () => {
    const onIncrease = jest.fn();
    const onDecrease = jest.fn();

    renderQuantity({ value: 3, onIncrease, onDecrease });

    fireEvent.press(screen.getByLabelText('Decrease quantity'));
    fireEvent.press(screen.getByLabelText('Increase quantity'));

    expect(onDecrease).toHaveBeenCalledTimes(1);
    expect(onIncrease).toHaveBeenCalledTimes(1);
  });

  it('disables decrease at min and increase at max', () => {
    renderQuantity({ value: 0, min: 0, max: 1 });

    expect(
      screen.getByLabelText('Decrease quantity').props.accessibilityState
        .disabled,
    ).toBe(true);

    renderQuantity({ value: 1, min: 0, max: 1 });

    expect(
      screen.getByLabelText('Increase quantity').props.accessibilityState
        .disabled,
    ).toBe(true);
  });
});
