import { render, screen, fireEvent } from '@testing-library/react-native';

// Component
import { NavigationButtons } from '@app/components/ui/NavigationButtons';

describe('NavigationButtons', () => {
  const defaultProps = {
    show: true,
    disabledLeft: false,
    disabledRight: false,
  };

  it('renders both buttons with default labels', () => {
    const { toJSON } = render(<NavigationButtons {...defaultProps} />);

    expect(screen.getByLabelText('Scroll left')).toBeTruthy();
    expect(screen.getByLabelText('Scroll right')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('does not render when show = false', () => {
    render(<NavigationButtons {...defaultProps} show={false} />);

    expect(screen.queryByLabelText('Scroll left')).toBeNull();
    expect(screen.queryByLabelText('Scroll right')).toBeNull();
  });

  it('calls onLeft/onRight when enabled', () => {
    const onLeft = jest.fn();
    const onRight = jest.fn();

    render(
      <NavigationButtons {...defaultProps} onLeft={onLeft} onRight={onRight} />,
    );

    fireEvent.press(screen.getByLabelText('Scroll left'));
    fireEvent.press(screen.getByLabelText('Scroll right'));

    expect(onLeft).toHaveBeenCalledTimes(1);
    expect(onRight).toHaveBeenCalledTimes(1);
  });

  it('does not call handlers when disabled', () => {
    const onLeft = jest.fn();
    const onRight = jest.fn();

    render(
      <NavigationButtons
        {...defaultProps}
        disabledLeft
        disabledRight
        onLeft={onLeft}
        onRight={onRight}
      />,
    );

    fireEvent.press(screen.getByLabelText('Scroll left'));
    fireEvent.press(screen.getByLabelText('Scroll right'));

    expect(onLeft).not.toHaveBeenCalled();
    expect(onRight).not.toHaveBeenCalled();
  });
});
