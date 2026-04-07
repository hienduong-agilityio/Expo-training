import { StyleSheet } from 'react-native';
import { colors } from '@app/themes';

const BTN = 40;

export const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -(BTN / 2) }],
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    backgroundColor: colors.surfaceVariant,
    shadowColor: colors.surfaceVariant,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  left: { left: 8 },
  right: { right: 8 },
  disabled: { opacity: 0.35 },
  pressed: {
    transform: [{ translateY: -(BTN / 2) }, { scale: 0.96 }],
    opacity: 0.8,
  },
});
