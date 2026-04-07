import { render, act } from '@testing-library/react-native';

// Components
import { ToastContainer } from '@app/components/ToastContainer';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Constants
import { STATUS, POSITION } from '@app/constants';

describe('ToastContainer', () => {
  beforeEach(() => {
    toastStore.getState().showToast({
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

    // Set up initial state
    act(() => {
      toastStore.setState({
        visible: true,
        message: 'Test message',
        duration: 1000,
      });
    });

    expect(toastStore.getState().visible).toBe(true);

    // Render component
    render(<ToastContainer />);

    // Advance timers - this should trigger the timeout
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Flush pending updates
    act(() => {
      jest.runAllTimers();
    });

    // Check that toast was hidden
    expect(toastStore.getState().visible).toBe(false);

    jest.useRealTimers();
  });
});
