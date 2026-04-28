// Hooks
import { useCartActions } from '@app/hooks/useCart';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Constants
import { STATUS, MESSAGES, TOAST_MESSAGES } from '@app/constants';

// Types
import type { IProduct } from '@app/interfaces/product';

/**
 * Hook for product cart operations with toast notifications
 */
export const useProductCart = () => {
  const { addItem } = useCartActions();
  const showToast = toastStore(state => state.showToast);

  const handleAddToCart = async (product: IProduct, size?: string) => {
    try {
      await addItem({
        productId: String(product.id),
        quantity: 1,
      });

      showToast({
        type: STATUS.SUCCESS,
        message: `${product.name} ${size ? `(${size})` : ''} added to cart`,
      });
    } catch {
      showToast({
        type: STATUS.ERROR,
        message: TOAST_MESSAGES.ADD_TO_CART_FAILED,
      });
    }
  };

  const handleBuyNow = (product: IProduct) => {
    showToast({
      type: STATUS.SUCCESS,
      message: `${MESSAGES.OR_CONTINUE_WITH} ${product.name}`,
    });
  };

  return { handleAddToCart, handleBuyNow };
};
