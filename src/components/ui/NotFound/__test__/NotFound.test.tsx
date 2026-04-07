import { render, screen, fireEvent } from '@testing-library/react-native';

// Components
import { NotFound } from '@app/components/ui/NotFound';

// Icons
import { CartIcon } from '@app/icons';

// Types
import type { INotFoundProps } from '@app/interfaces';

describe('NotFound', () => {
  const renderNotFound = (props: INotFoundProps) => {
    return render(<NotFound {...props} />);
  };

  it('renders with default title and without description', () => {
    const { toJSON } = renderNotFound({});

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.queryByText('Please try again later.')).toBeNull();

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders description when provided', () => {
    renderNotFound({ description: 'Please try again later.' });

    expect(screen.getByText('Please try again later.')).toBeTruthy();
  });

  it('hides retry button when onRetry is not provided', () => {
    renderNotFound({
      title: 'No internet',
      description: 'Connect to continue.',
    });

    expect(screen.queryByText('Try Again')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    renderNotFound({
      description: 'Failed to load data.',
      retryLabel: 'Retry',
      onRetry,
    });

    fireEvent.press(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('accepts a ReactNode icon', () => {
    const { toJSON } = renderNotFound({
      title: 'Your cart is empty',
      icon: <CartIcon size={24} />,
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
