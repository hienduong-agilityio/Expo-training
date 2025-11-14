import { useCallback } from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { Button } from '@app/components/common/Button';
import { AuthTextField } from '@app/components/ui/AuthTextField';
import { AuthFooter } from '@app/components/ui/AuthFooter';
import { AuthScreenLayout } from '@app/components/ui/AuthScreenLayout';

// Icons
import { UserIcon, PassIcon } from '@app/icons';

// Constants
import {
  AUTH_FORM_MESSAGES,
  BUTTON_LABELS,
  LINK_MESSAGES,
  PUBLIC_SCREENS,
} from '@app/constants';

// Interfaces
import { PublicStackScreenProps } from '@app/interfaces';

// Styles
import { authStyles } from '@app/styles';

type LoginScreenProps = PublicStackScreenProps<typeof PUBLIC_SCREENS.LOGIN>;

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const handleRegister = useCallback(() => {
    navigation.navigate(PUBLIC_SCREENS.REGISTER);
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    Alert.alert(BUTTON_LABELS.FORGOT_PASSWORD, LINK_MESSAGES.RESET_PASSWORD);
  }, []);

  return (
    <SafeAreaView style={authStyles.screen}>
      <AuthScreenLayout title={AUTH_FORM_MESSAGES.WELCOME_BACK}>
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.USERNAME_OR_EMAIL}
          onChangeText={() => {}}
          leftIcon={<UserIcon width={20} height={20} />}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.PASSWORD}
          onChangeText={() => {}}
          leftIcon={<PassIcon width={20} height={20} />}
          isPassword
        />

        <TouchableOpacity
          style={authStyles.linkContainer}
          onPress={handleForgotPassword}>
          <Text style={authStyles.linkText}>
            {BUTTON_LABELS.FORGOT_PASSWORD}
          </Text>
        </TouchableOpacity>

        <Button
          fullWidth
          size="lg"
          disabled={false}
          label={BUTTON_LABELS.LOGIN}
        />

        <AuthFooter
          helperText={AUTH_FORM_MESSAGES.DONT_HAVE_AN_ACCOUNT}
          helperActionLabel={BUTTON_LABELS.REGISTER}
          onHelperActionPress={handleRegister}
          onSocialSelect={() => {}}
        />
      </AuthScreenLayout>
    </SafeAreaView>
  );
};
