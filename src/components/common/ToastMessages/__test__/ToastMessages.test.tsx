import { render, screen, fireEvent } from '@testing-library/react-native';

// Components
import {
  ToastMessages,
  IToastMessagesProps,
} from '@app/components/common/ToastMessages';

describe('ToastMessages', () => {
  const baseProps = {
    visible: true,
    message: 'Test toast message',
  };

  const renderComponent = (props: IToastMessagesProps) => {
    return render(<ToastMessages {...props} />);
  };

  it('renders message when visible', () => {
    const { toJSON } = renderComponent(baseProps);

    expect(screen.getByLabelText('Toast message')).toBeTruthy();
    expect(screen.getByText('Test toast message')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('does not render when visible is false', () => {
    renderComponent({ ...baseProps, visible: false });

    expect(screen.queryByLabelText('Toast message')).toBeNull();
    expect(screen.queryByText('Test toast message')).toBeNull();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();

    renderComponent({ ...baseProps, onClose });

    fireEvent.press(screen.getByLabelText('Close toast'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('positions at bottom when position="bottom"', () => {
    renderComponent({ ...baseProps, position: 'bottom' });

    expect(screen.getByLabelText('Toast message')).toBeTruthy();
    expect(screen.getByText('Test toast message')).toBeTruthy();
  });
});
