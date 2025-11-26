import { toastStore } from '../toastStore';
import { STATUS, POSITION } from '@app/constants';

describe('toastStore', () => {
  beforeEach(() => {
    // Reset store state
    toastStore.setState({
      visible: false,
      message: '',
      type: STATUS.INFO,
      position: POSITION.TOP,
      duration: 1000,
    });
  });

  it('initializes with default values', () => {
    const state = toastStore.getState();
    expect(state.visible).toBe(false);
    expect(state.message).toBe('');
    expect(state.type).toBe(STATUS.INFO);
    expect(state.position).toBe(POSITION.TOP);
  });

  it('shows toast with default options', () => {
    toastStore.getState().showToast({ message: 'Test message' });

    const state = toastStore.getState();
    expect(state.visible).toBe(true);
    expect(state.message).toBe('Test message');
    expect(state.type).toBe(STATUS.INFO);
    expect(state.position).toBe(POSITION.TOP);
  });

  it('shows toast with custom options', () => {
    toastStore.getState().showToast({
      message: 'Error occurred',
      type: STATUS.ERROR,
      position: POSITION.BOTTOM,
      duration: 2000,
    });

    const state = toastStore.getState();
    expect(state.visible).toBe(true);
    expect(state.message).toBe('Error occurred');
    expect(state.type).toBe(STATUS.ERROR);
    expect(state.position).toBe(POSITION.BOTTOM);
    expect(state.duration).toBe(2000);
  });

  it('hides toast correctly', () => {
    // First show a toast
    toastStore.getState().showToast({ message: 'Test' });

    // Then hide it
    toastStore.getState().hideToast();

    const state = toastStore.getState();
    expect(state.visible).toBe(false);
    expect(state.message).toBe('');
  });
});
