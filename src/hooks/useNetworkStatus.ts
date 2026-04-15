import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNetworkState, type NetworkState } from 'expo-network';

const isOnline = (state: NetworkState): boolean => {
  return state.isConnected !== false && state.isInternetReachable !== false;
};

export const useNetworkStatus = () => {
  const networkState = useNetworkState();

  const isConnected = useMemo(() => isOnline(networkState), [networkState]);

  const [dismissedWhileOffline, setDismissedWhileOffline] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissedWhileOffline(false);
  }, [isConnected]);

  const showOfflineModal = useMemo(
    () => !isConnected && !dismissedWhileOffline,
    [isConnected, dismissedWhileOffline],
  );

  const closeModal = useCallback(() => {
    setDismissedWhileOffline(true);
  }, []);

  return {
    isConnected,
    showOfflineModal,
    closeModal,
  };
};
