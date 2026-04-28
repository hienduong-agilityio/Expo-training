import { ReactNode } from 'react';

// Components
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

// Styles
import { styles } from './index.style';

interface IAuthScreenLayoutProps {
  title: string;
  children: ReactNode;
}

export const AuthScreenLayout = ({
  title,
  children,
}: IAuthScreenLayoutProps) => {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: 'padding', android: 'height' })}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.form}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
