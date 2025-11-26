import { View, ViewStyle, StyleProp } from 'react-native';

// Components
import { NotFound } from '@app/components/ui/NotFound';

interface IErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ErrorState = ({
  title = 'Error',
  description,
  retryLabel = 'Retry',
  onRetry,
  containerStyle,
}: IErrorStateProps) => {
  return (
    <View style={containerStyle}>
      <NotFound
        title={title}
        description={description}
        retryLabel={retryLabel}
        onRetry={onRetry}
      />
    </View>
  );
};
