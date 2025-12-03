import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useMemo, useCallback } from 'react';

// Hooks
import { useCart } from '@app/hooks/useCart';
import { useProductsByIds } from '@app/hooks/useProduct';

// Stores
import { toastStore } from '@app/stores/toastStore';
import { modalStore } from '@app/stores/modalStore';

// Components
import { CartItem } from '@app/components/ui/CartItem';
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { Button } from '@app/components/common/Button';

// Constants
import {
  STATUS,
  PRIVATE_SCREENS,
  TOAST_MESSAGES,
  LOADING_MESSAGES,
  CART_MESSAGES,
  BUTTON_LABELS,
} from '@app/constants';

// Types
import type { ICartItem } from '@app/interfaces/cart';
import type { PrivateTabScreenProps } from '@app/interfaces/navigation';

// Styles
import { styles } from './index.style';

// Enums
import { BUTTON_VARIANTS } from '@app/enums';

type CartScreenProps = PrivateTabScreenProps<typeof PRIVATE_SCREENS.CART>;

export const CartScreen = ({ navigation }: CartScreenProps) => {
  const showToast = toastStore(state => state.showToast);
  const showConfirm = modalStore(state => state.showConfirm);

  const {
    cart,
    cartItems,
    isLoading,
    isMutating,
    refetch,
    updateItem,
    removeItem,
  } = useCart();

  const productIds = cartItems.map((item: ICartItem) => item.productId);

  const { productMap, isLoading: isLoadingProducts } =
    useProductsByIds(productIds);

  const handleRemoveItem = async (productId: string) => {
    await removeItem(productId);

    showToast({
      type: STATUS.SUCCESS,
      message: TOAST_MESSAGES.REMOVED_FROM_CART,
    });
  };

  const handleIncreaseQuantity = async (
    productId: string,
    currentQuantity: number,
  ) => {
    await updateItem({
      productId,
      quantity: currentQuantity + 1,
    });
  };

  const handleDecreaseQuantity = async (
    productId: string,
    currentQuantity: number,
  ) => {
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
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      const price = product?.price ?? 0;

      return sum + price * item.quantity;
    }, 0);
  }, [cartItems, productMap]);

  const handleCheckout = useCallback(() => {
    navigation.navigate(PRIVATE_SCREENS.CHECKOUT);
  }, [navigation]);

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

  const refreshing = isLoading || isMutating;

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
            key={item.productId || index}
            {...product}
            quantity={item.quantity}
            onIncrease={() =>
              handleIncreaseQuantity(item.productId, item.quantity)
            }
            onDecrease={() =>
              handleDecreaseQuantity(item.productId, item.quantity)
            }
            onRemove={() =>
              showConfirm({
                title: CART_MESSAGES.REMOVE_TITLE,
                message: CART_MESSAGES.REMOVE_MESSAGE,
                confirmLabel: BUTTON_LABELS.REMOVE,
                cancelLabel: BUTTON_LABELS.CANCEL,
                isDestructive: true,
                onConfirm: () => handleRemoveItem(item.productId),
              })
            }
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
