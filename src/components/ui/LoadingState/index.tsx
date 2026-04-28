import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

interface ILoadingStateProps {
  message?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const LoadingState = ({
  message = 'Loading...',
  containerStyle,
}: ILoadingStateProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['4'],
  },
  message: {
    marginTop: spacing['4'],
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
