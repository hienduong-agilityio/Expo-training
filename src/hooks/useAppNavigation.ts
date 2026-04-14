import { useCallback } from 'react';

import { useRouter } from 'expo-router';

export const useAppNavigation = () => {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  }, [router]);

  const navigateToDetail = useCallback(
    (productId: string) => {
      router.push(`/product/${productId}`);
    },
    [router],
  );

  return {
    handleGoBack,
    navigateToDetail,
    router,
  };
};
