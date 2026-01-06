import { colors } from '@app/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});
