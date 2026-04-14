import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useMemo, useCallback } from 'react';
import { useRouter } from 'expo-router';

// Hooks
import { useCart, useCartActions } from '@app/hooks/useCart';
import { useProductsByIds } from '@app/hooks/useProduct';

// Stores
import { modalStore } from '@app/stores/modalStore';

// Components
import { CartItem } from '@app/components/ui/CartItem';
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { Button } from '@app/components/common/Button';

// Constants
import {
  LOADING_MESSAGES,
  CART_MESSAGES,
  BUTTON_LABELS,
} from '@app/constants';

// Types
import type { ICartItem } from '@app/interfaces/cart';

// Styles
import { styles } from './index.style';

// Enums
import { BUTTON_VARIANTS } from '@app/enums';

export const CartScreen = () => {
  const router = useRouter();
  const { cart, cartItems, isLoading, refetch } = useCart();

  const { updateItem, removeItem, isMutating } = useCartActions();

  const productIds = useMemo(
    () => cartItems.map((item: ICartItem) => item.productId),
    [cartItems],
  );

  const { productMap, isLoading: isLoadingProducts } =
    useProductsByIds(productIds);

  const showConfirm = modalStore(state => state.showConfirm);

  const handleRemoveItem = useCallback(
    async (productId: string) => {
      await removeItem(productId);
    },
    [removeItem],
  );

  const handleIncreaseQuantity = useCallback(
    async (productId: string, currentQuantity: number) => {
      await updateItem({ productId, quantity: currentQuantity + 1 });
    },
    [updateItem],
  );

  const handleDecreaseQuantity = useCallback(
    async (productId: string, currentQuantity: number) => {
      if (currentQuantity <= 1) {
        showConfirm({
          title: CART_MESSAGES.REMOVE_TITLE,
          message: CART_MESSAGES.REMOVE_MESSAGE,
          confirmLabel: BUTTON_LABELS.REMOVE,
          cancelLabel: BUTTON_LABELS.CANCEL,
          isDestructive: true,
          onConfirm: () => handleRemoveItem(productId),
        });

        return;
      }

      await updateItem({
        productId,
        quantity: currentQuantity - 1,
      });
    },
    [handleRemoveItem, showConfirm, updateItem],
  );

  const handleRequestRemove = useCallback(
    (productId: string) => {
      showConfirm({
        title: CART_MESSAGES.REMOVE_TITLE,
        message: CART_MESSAGES.REMOVE_MESSAGE,
        confirmLabel: BUTTON_LABELS.REMOVE,
        cancelLabel: BUTTON_LABELS.CANCEL,
        isDestructive: true,
        onConfirm: () => handleRemoveItem(productId),
      });
    },
    [showConfirm, handleRemoveItem],
  );

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum: number, item: ICartItem) => {
      const product = productMap.get(item.productId);
      const price = product?.price ?? 0;

      return sum + price * item.quantity;
    }, 0);
  }, [cartItems, productMap]);

  const refreshing = isLoading || isMutating;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading || isLoadingProducts) {
    return (
      <View style={styles.container}>
        <LoadingState
          message={LOADING_MESSAGES.CART}
          containerStyle={styles.loadingContainer}
        />
      </View>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <NotFound
          title={CART_MESSAGES.EMPTY}
          description={CART_MESSAGES.EMPTY_DESCRIPTION}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refetch} />
      }
      contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{CART_MESSAGES.SHOPPING_CART}</Text>

      {cartItems.map((item: ICartItem, index: number) => {
        const product = productMap.get(item.productId);

        if (!product) return null;

        return (
          <CartItem
            {...product}
            key={item.productId || index}
            id={item.productId}
            quantity={item.quantity}
            onIncrease={handleIncreaseQuantity}
            onDecrease={handleDecreaseQuantity}
            onRemove={handleRequestRemove}
          />
        );
      })}

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{CART_MESSAGES.TOTAL}</Text>
          <Text style={styles.totalPrice}>₹ {totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            label={BUTTON_LABELS.CHECKOUT}
            onPress={handleCheckout}
            variant={BUTTON_VARIANTS.SOLID}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </ScrollView>
  );
};
