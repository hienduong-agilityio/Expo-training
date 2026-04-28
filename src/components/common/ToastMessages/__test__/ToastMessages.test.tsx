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
    const { toJSON } = renderComponent({ ...baseProps, position: 'bottom' });

    expect(screen.getByLabelText('Toast message')).toBeTruthy();
    expect(screen.getByText('Test toast message')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('positions at top by default', () => {
    const { toJSON } = renderComponent({ ...baseProps });

    expect(screen.getByLabelText('Toast message')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with different status types', () => {
    const statusTypes = ['error', 'success', 'info', 'warning'] as const;

    statusTypes.forEach(status => {
      const { toJSON } = renderComponent({ ...baseProps, type: status });
      expect(screen.getByText('Test toast message')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot(`status-${status}`);
    });
  });

  it('handles undefined onClose', () => {
    renderComponent({ ...baseProps, onClose: undefined });

    const closeButton = screen.getByLabelText('Close toast');
    fireEvent.press(closeButton);

    // Should not throw error
    expect(closeButton).toBeTruthy();
  });

  it('renders with custom styles', () => {
    const customStyle = {
      container: { backgroundColor: 'red' },
      accentBar: { height: 5 },
      iconContainer: { padding: 10 },
      messageContainer: { padding: 5 },
      message: { fontSize: 14 },
      actionsContainer: { padding: 5 },
      closeButton: { width: 30 },
      closeText: { fontSize: 12 },
    };

    const { toJSON } = renderComponent({
      ...baseProps,
      customStyle,
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
