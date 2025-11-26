import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

// Components
import { ToastContainer } from '@app/components/ToastContainer';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Constants
import { STATUS, POSITION } from '@app/constants';

describe('ToastContainer', () => {
  beforeEach(() => {
    // Reset toast store before each test
    toastStore.setState({
      visible: false,
      message: '',
      type: STATUS.INFO,
      position: POSITION.TOP,
      duration: 1000,
    });
  });

  it('renders correctly when toast is not visible', () => {
    const { toJSON } = render(<ToastContainer />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders toast when visible', () => {
    act(() => {
      toastStore.getState().showToast({
        message: 'Test message',
        type: STATUS.SUCCESS,
        position: POSITION.TOP,
      });
    });

    const { toJSON } = render(<ToastContainer />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('hides toast after duration', () => {
    jest.useFakeTimers();

    act(() => {
      toastStore.getState().showToast({
        message: 'Test message',
        duration: 1000,
      });
    });

    const { rerender } = render(<ToastContainer />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    rerender(<ToastContainer />);

    expect(toastStore.getState().visible).toBe(false);

    jest.useRealTimers();
  });
});
