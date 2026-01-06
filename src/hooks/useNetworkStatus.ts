import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);

  const applyState = useCallback((state: NetInfoState) => {
    const isOnline =
      state.isConnected !== false && state.isInternetReachable !== false;

    setIsConnected(isOnline);
    setShowOfflineModal(!isOnline);
  }, []);

  const closeModal = useCallback(() => {
    setShowOfflineModal(false);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(applyState);

    return unsubscribe;
  }, [applyState]);

  return {
    isConnected,
    showOfflineModal,
    closeModal,
  };
};
