import { View, Text } from 'react-native';

// Styles
import { styles } from './index.style';

interface IDeliveryInfoProps {
  deliveryTime?: string;
}

export const DeliveryInfo = ({
  deliveryTime = '1 within Hour',
}: IDeliveryInfoProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.deliveryText}>Delivery in</Text>
      <Text style={styles.deliveryTime}>{deliveryTime}</Text>
    </View>
  );
};
