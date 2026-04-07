import { renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFirstLaunch } from '../useFirstLaunch';

describe('useFirstLaunch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null initially', () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(null), 0)),
    );

    const { result } = renderHook(() => useFirstLaunch());

    expect(result.current).toBe(null);
  });

  it('should return true when HAS_SEEN_ONBOARDING is null (first launch)', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('HAS_SEEN_ONBOARDING');
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should return false when HAS_SEEN_ONBOARDING exists (not first launch)', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('HAS_SEEN_ONBOARDING');
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should return false when AsyncStorage throws an error', async () => {
    const error = new Error('Storage error');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('HAS_SEEN_ONBOARDING');
  });

  it('should only check onboarding status once on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result, rerender } = renderHook(() => useFirstLaunch());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    rerender({});

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should handle empty string value as not first launch', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('');

    const { result } = renderHook(() => useFirstLaunch());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});
