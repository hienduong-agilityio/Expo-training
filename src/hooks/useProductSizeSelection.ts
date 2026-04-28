import { useState, useCallback, useMemo } from 'react';

// Types
import type { IProductSize } from '@app/interfaces/product';

/**
 * Hook to manage product size selection logic.
 */
export const useProductSizeSelection = (
  productId: string | undefined,
  productSizes: IProductSize[],
) => {
  const [sizeMap, setSizeMap] = useState<Record<string, string>>({});

  const currentSize = useMemo(() => {
    return productId ? sizeMap[productId] : '';
  }, [productId, sizeMap]);

  const defaultSize = useMemo(() => {
    return productSizes.find(size => size.available)?.size || '';
  }, [productSizes]);

  const selectedSize = useMemo(() => {
    if (!currentSize) return defaultSize;

    const isAvailable = productSizes.some(
      size => size.size === currentSize && size.available,
    );

    return isAvailable ? currentSize : defaultSize;
  }, [currentSize, defaultSize, productSizes]);

  const handleSizeSelect = useCallback(
    (sizeId: string) => {
      if (!productId) return;

      const sizeObj = productSizes.find(size => size.id === sizeId);

      if (sizeObj?.available) {
        setSizeMap(prev => ({
          ...prev,
          [productId]: sizeObj.size,
        }));
      }
    },
    [productId, productSizes],
  );

  return {
    selectedSize,
    handleSizeSelect,
  };
};
