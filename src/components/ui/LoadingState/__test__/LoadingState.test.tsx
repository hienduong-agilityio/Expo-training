import { render, screen } from '@testing-library/react-native';

// Components
import { LoadingState } from '@app/components/ui/LoadingState';

describe('LoadingState', () => {
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      ...overrides,
    };
    return render(<LoadingState {...defaultProps} />);
  };

  it('renders correctly with default message', () => {
    const { toJSON } = renderComponent();

    expect(screen.getByText('Loading...')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with custom message', () => {
    renderComponent({ message: 'Fetching data...' });

    expect(screen.getByText('Fetching data...')).toBeTruthy();
  });

  it('renders without message when message is empty', () => {
    const { toJSON } = renderComponent({ message: '' });

    expect(screen.queryByText('Loading...')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
