import { useCallback } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Components
import { AuthTextField } from '@app/components/ui/AuthTextField';
import { AuthFooter } from '@app/components/ui/AuthFooter';
import { AuthScreenLayout } from '@app/components/ui/AuthScreenLayout';
import { LoadingButton } from '@app/components/common/LoadingButton';

// Icons
import { UserIcon, PassIcon } from '@app/icons';

// Constants
import {
  AUTH_FORM_MESSAGES,
  BUTTON_LABELS,
  LINK_MESSAGES,
} from '@app/constants';
import { AUTH_FIELDS } from '@app/constants/auth';

// Hooks
import { useForm } from '@app/hooks/useForm';
import { useAuthActions } from '@app/hooks/useAuthActions';

// Helpers
import { validateLogin } from '@app/helpers/validation';

// Schemas
import { LoginFormValues } from '@app/schemas/auth';

// Styles
import { authStyles } from '@app/styles';

export const LoginScreen = () => {
  const router = useRouter();
  const initialValues = {
    [AUTH_FIELDS.IDENTIFIER]: '',
    [AUTH_FIELDS.PASSWORD]: '',
  };

  const { values, fieldErrors, handleChange, resetForm, setFieldError } =
    useForm({
      initialValues,
    });

  const { login, isSubmitting } = useAuthActions();

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const validationResult = validateLogin(values as LoginFormValues);

    if (!validationResult.ok) {
      Object.entries(validationResult.errors).forEach(([field, error]) => {
        if (error) setFieldError(field as keyof LoginFormValues, error);
      });

      return;
    }

    await login(validationResult.payload);
    resetForm();
  }, [isSubmitting, values, setFieldError, login, resetForm]);

  return (
    <SafeAreaView style={authStyles.screen}>
      <AuthScreenLayout title={AUTH_FORM_MESSAGES.WELCOME_BACK}>
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.USERNAME_OR_EMAIL}
          value={values.identifier}
          onChangeText={text => handleChange(AUTH_FIELDS.IDENTIFIER, text)}
          leftIcon={<UserIcon width={28} height={28} />}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={fieldErrors.identifier}
          editable={!isSubmitting}
        />

        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.PASSWORD}
          value={values.password}
          onChangeText={text => handleChange(AUTH_FIELDS.PASSWORD, text)}
          leftIcon={<PassIcon width={24} height={24} />}
          isPassword
          error={fieldErrors.password}
          editable={!isSubmitting}
        />

        <TouchableOpacity
          style={authStyles.linkContainer}
          disabled={isSubmitting}
          onPress={() =>
            Alert.alert(
              BUTTON_LABELS.FORGOT_PASSWORD,
              LINK_MESSAGES.RESET_PASSWORD,
            )
          }>
          <Text style={authStyles.linkText}>
            {BUTTON_LABELS.FORGOT_PASSWORD}
          </Text>
        </TouchableOpacity>

        <LoadingButton
          fullWidth
          size="lg"
          label={BUTTON_LABELS.LOGIN}
          loadingLabel={BUTTON_LABELS.LOGGING_IN}
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit}
        />

        <AuthFooter
          helperText={AUTH_FORM_MESSAGES.CREATE_AN_ACCOUNT}
          helperActionLabel={BUTTON_LABELS.REGISTER}
          disabled={isSubmitting}
          // Todo: Convert string to constant
          onHelperActionPress={() => router.push('/register')}
        />
      </AuthScreenLayout>
    </SafeAreaView>
  );
};
