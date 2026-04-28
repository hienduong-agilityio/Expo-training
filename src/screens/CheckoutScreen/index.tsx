import { useMemo, useCallback, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Hooks
import { useCart, useCartActions } from '@app/hooks/useCart';
import { useProductsByIds } from '@app/hooks/useProduct';

// Components
import { PaymentMethods } from '@app/components/ui/PaymentMethods';
import { LoadingState } from '@app/components/ui/LoadingState';
import { Button } from '@app/components/common/Button';

// Types
import type { PaymentProvider } from '@app/constants';
import type { ICartItem } from '@app/interfaces/cart';

// Constants
import {
  LOADING_MESSAGES,
  CART_MESSAGES,
  CHECKOUT_MESSAGES,
  BUTTON_LABELS,
  PAYMENT_PROVIDER,
} from '@app/constants';

// Mocks
import { MOCK_PAYMENT_OPTIONS } from '@app/mocks/payments';

// Styles
import { styles } from './index.style';

const SHIPPING_PRICE = 30;

export const CheckoutScreen = () => {
  const router = useRouter();
  const { cart, cartItems, isLoading } = useCart();
  const { checkout } = useCartActions();

  const [selectedPayment, setSelectedPayment] = useState<PaymentProvider>(
    PAYMENT_PROVIDER.VISA,
  );

  const productIds = useMemo(
    () => cartItems.map((item: ICartItem) => item.productId),
    [cartItems],
  );

  const { productMap, isLoading: isLoadingProducts } =
    useProductsByIds(productIds);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum: number, item: ICartItem) => {
      const product = productMap.get(item.productId);
      const price = product?.price ?? 0;

      return sum + price * item.quantity;
    }, 0);
  }, [cartItems, productMap]);

  const orderTotal = totalPrice + SHIPPING_PRICE;

  const handlePaymentSelect = (id: PaymentProvider) => {
    setSelectedPayment(id);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleCheckout = useCallback(async () => {
    await checkout();
    router.back();
  }, [checkout, router]);

  if (isLoading || isLoadingProducts) {
    return (
      <View style={styles.container}>
        <LoadingState
          message={LOADING_MESSAGES.CHECKOUT}
          containerStyle={styles.loadingContainer}
        />
      </View>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{CART_MESSAGES.EMPTY}</Text>
        <Button
          label={BUTTON_LABELS.GO_TO_CART}
          onPress={handleGoBack}
          fullWidth
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{CHECKOUT_MESSAGES.ORDER}</Text>
          <Text style={styles.summaryValue}>₹ {totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{CHECKOUT_MESSAGES.SHIPPING}</Text>
          <Text style={styles.summaryValue}>₹ {SHIPPING_PRICE.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>{CHECKOUT_MESSAGES.TOTAL}</Text>
          <Text style={styles.totalValue}>₹ {orderTotal.toFixed(2)}</Text>
        </View>
      </View>

      <PaymentMethods
        title={CHECKOUT_MESSAGES.PAYMENT}
        options={MOCK_PAYMENT_OPTIONS}
        selectedId={selectedPayment}
        onSelect={handlePaymentSelect}
        onContinue={handleCheckout}
      />
    </ScrollView>
  );
};
