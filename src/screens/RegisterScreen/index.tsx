import { useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  NAVIGATION_DELAYS,
  PUBLIC_SCREENS,
} from '@app/constants';
import { AUTH_FIELDS } from '@app/constants/auth';

// Types
import type { PublicStackScreenProps } from '@app/interfaces';

// Styles
import { authStyles } from '@app/styles';

// Hooks
import { useForm } from '@app/hooks/useForm';
import { useAuthActions } from '@app/hooks/useAuthActions';

// Helpers
import { validateRegister } from '@app/helpers/validation';

// Schemas
import { RegisterFormValues } from '@app/schemas/auth';

type RegisterScreenProps = PublicStackScreenProps<
  typeof PUBLIC_SCREENS.REGISTER
>;

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { values, fieldErrors, handleChange, resetForm, setFieldError } =
    useForm({
      initialValues: {
        [AUTH_FIELDS.USERNAME]: '',
        [AUTH_FIELDS.EMAIL]: '',
        [AUTH_FIELDS.PASSWORD]: '',
        [AUTH_FIELDS.CONFIRM_PASSWORD]: '',
      },
    });

  const { register, isSubmitting } = useAuthActions();

  const navigateToLogin = useCallback(
    () => navigation.navigate(PUBLIC_SCREENS.LOGIN),
    [navigation],
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const validationResult = validateRegister(values as RegisterFormValues);

    if (!validationResult.ok) {
      Object.entries(validationResult.errors).forEach(([field, error]) => {
        if (
          error &&
          (field === AUTH_FIELDS.USERNAME ||
            field === AUTH_FIELDS.EMAIL ||
            field === AUTH_FIELDS.PASSWORD ||
            field === AUTH_FIELDS.CONFIRM_PASSWORD)
        ) {
          setFieldError(field as keyof RegisterFormValues, error);
        }
      });

      return;
    }

    await register(validationResult.payload);

    resetForm();

    navigationTimerRef.current = setTimeout(
      navigateToLogin,
      NAVIGATION_DELAYS.AFTER_REGISTER,
    );
  }, [
    isSubmitting,
    values,
    setFieldError,
    register,
    resetForm,
    navigateToLogin,
  ]);

  return (
    <SafeAreaView style={authStyles.screen}>
      <AuthScreenLayout title={AUTH_FORM_MESSAGES.CREATE_ACCOUNT}>
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.USERNAME}
          value={values.username}
          onChangeText={text => handleChange(AUTH_FIELDS.USERNAME, text)}
          leftIcon={<UserIcon width={20} height={20} />}
          autoCapitalize="none"
          autoCorrect={false}
          error={fieldErrors.username}
        />
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.EMAIL}
          value={values.email}
          onChangeText={text => handleChange(AUTH_FIELDS.EMAIL, text)}
          leftIcon={<UserIcon width={20} height={20} />}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={fieldErrors.email}
        />
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.PASSWORD}
          value={values.password}
          onChangeText={text => handleChange(AUTH_FIELDS.PASSWORD, text)}
          leftIcon={<PassIcon width={20} height={20} />}
          isPassword
          error={fieldErrors.password}
        />
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.CONFIRM_PASSWORD}
          value={values.confirmPassword}
          onChangeText={text =>
            handleChange(AUTH_FIELDS.CONFIRM_PASSWORD, text)
          }
          leftIcon={<PassIcon width={20} height={20} />}
          isPassword
          error={fieldErrors.confirmPassword}
        />

        <LoadingButton
          fullWidth
          size="lg"
          label={BUTTON_LABELS.REGISTER}
          disabled={isSubmitting}
          loadingLabel={BUTTON_LABELS.REGISTERING}
          loading={isSubmitting}
          onPress={handleSubmit}
        />

        <AuthFooter
          helperText={AUTH_FORM_MESSAGES.CREATE_AN_ACCOUNT}
          helperActionLabel={BUTTON_LABELS.LOGIN}
          onHelperActionPress={navigateToLogin}
        />
      </AuthScreenLayout>
    </SafeAreaView>
  );
};
