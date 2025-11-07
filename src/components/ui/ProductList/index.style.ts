import { StyleSheet } from 'react-native';

// Enums
import { colors } from '@app/themes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { paddingVertical: 16, alignItems: 'center' },
  itemContainer: {},
  productCard: { width: '100%' },
  emptyWrap: { minHeight: 200, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: colors.textMuted, textAlign: 'center' },
});
