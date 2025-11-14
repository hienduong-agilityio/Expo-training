import { useCallback } from 'react';
import { Text, View } from 'react-native';
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
  PUBLIC_SCREENS,
} from '@app/constants';

// Interfaces
import { PublicStackScreenProps } from '@app/interfaces';

// Styles
import { authStyles } from '@app/styles';

// Enums

type RegisterScreenProps = PublicStackScreenProps<
  typeof PUBLIC_SCREENS.REGISTER
>;

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const handleLogin = useCallback(() => {
    navigation.navigate(PUBLIC_SCREENS.LOGIN);
  }, [navigation]);

  return (
    <SafeAreaView style={authStyles.screen}>
      <AuthScreenLayout title={AUTH_FORM_MESSAGES.CREATE_ACCOUNT}>
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

        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.CONFIRM_PASSWORD}
          onChangeText={() => {}}
          leftIcon={<PassIcon width={20} height={20} />}
          isPassword
        />

        <View style={authStyles.agreementContainer}>
          <Text style={authStyles.agreementText}>
            {AUTH_FORM_MESSAGES.BY_CLICKING_REGISTER}
          </Text>
        </View>

        <Button
          fullWidth
          size="lg"
          disabled={false}
          label={BUTTON_LABELS.REGISTER}
        />

        <AuthFooter
          helperText={AUTH_FORM_MESSAGES.DONT_HAVE_AN_ACCOUNT}
          helperActionLabel={BUTTON_LABELS.LOGIN}
          onHelperActionPress={handleLogin}
          onSocialSelect={() => {}}
        />
      </AuthScreenLayout>
    </SafeAreaView>
  );
};
