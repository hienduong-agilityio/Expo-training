import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Hooks
import { useCart } from '@app/hooks/useCart';
import { useProductsByIds } from '@app/hooks/useProduct';

// Components
import { PaymentMethods } from '@app/components/ui/PaymentMethods';
import { LoadingState } from '@app/components/ui/LoadingState';
import { Button } from '@app/components/common/Button';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Types
import type { PrivateStackParamList } from '@app/interfaces/navigation';
import type { PaymentProvider } from '@app/constants';

// Constants
import {
  PRIVATE_SCREENS,
  STATUS,
  TOAST_MESSAGES,
  LOADING_MESSAGES,
  CART_MESSAGES,
  CHECKOUT_MESSAGES,
  BUTTON_LABELS,
  PAYMENT_PROVIDER,
} from '@app/constants';
import { MOCK_PAYMENT_OPTIONS } from '@app/mocks/payments';

// Styles
import { styles } from './index.style';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  typeof PRIVATE_SCREENS.CHECKOUT
>;

const SHIPPING_PRICE = 30;

export const CheckoutScreen = ({ navigation }: Props) => {
  const { showToast } = toastStore();
  const { cart, cartItems, isLoading, checkout } = useCart();

  const [selectedPayment, setSelectedPayment] = useState<PaymentProvider>(
    PAYMENT_PROVIDER.VISA,
  );

  const productIds = cartItems.map(item => item.productId);

  const { productMap, isLoading: isLoadingProducts } =
    useProductsByIds(productIds);

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    const price = product?.price ?? 0;

    return sum + price * item.quantity;
  }, 0);

  const orderTotal = totalPrice + SHIPPING_PRICE;

  const handlePaymentSelect = (id: PaymentProvider) => {
    setSelectedPayment(id);
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      navigation.goBack();

      setTimeout(() => {
        showToast({
          type: STATUS.SUCCESS,
          message: TOAST_MESSAGES.PAYMENT_SUCCESS,
        });
      }, 100);
    } catch {
      showToast({
        type: STATUS.ERROR,
        message: TOAST_MESSAGES.PAYMENT_FAILED,
      });
    }
  };

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
          onPress={() => navigation.goBack()}
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
