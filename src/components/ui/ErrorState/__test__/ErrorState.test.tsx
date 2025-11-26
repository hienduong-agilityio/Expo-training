import { fireEvent, render, screen } from '@testing-library/react-native';

// Components
import { ErrorState } from '@app/components/ui/ErrorState';

describe('ErrorState', () => {
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      ...overrides,
    };
    return render(<ErrorState {...defaultProps} />);
  };

  it('renders correctly with default props', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText('Error')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with custom title and description', () => {
    renderComponent({
      title: 'Network Error',
      description: 'Please check your connection',
    });

    expect(screen.getByText('Network Error')).toBeTruthy();
    expect(screen.getByText('Please check your connection')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    renderComponent({
      retryLabel: 'Try Again',
      onRetry,
    });

    fireEvent.press(screen.getByText('Try Again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides retry button when onRetry is not provided', () => {
    renderComponent({
      title: 'Error',
      description: 'Something went wrong',
    });

    expect(screen.queryByText('Retry')).toBeNull();
  });
});
