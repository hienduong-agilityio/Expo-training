import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    marginRight: spacing['2'],
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const defaultNavOptions = {
  title: '',
  headerStyle: {
    backgroundColor: colors.grayLight,
  },
} as const;
