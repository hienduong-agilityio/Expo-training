import { useCallback } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
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
  ERROR_MESSAGES,
  LINK_MESSAGES,
  POSITION,
  PUBLIC_SCREENS,
  STATUS,
  TOAST_MESSAGES,
} from '@app/constants';
import { AUTH_FIELDS } from '@app/constants/auth';

// Types
import type { PublicStackScreenProps } from '@app/interfaces';

// Hooks
import { useForm } from '@app/hooks/useForm';
import { useAuthActions } from '@app/hooks/useAuthActions';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Helpers
import { getApiErrorMessage } from '@app/helpers/errorMessage';
import { validateLogin } from '@app/helpers/validation';

// Schemas
import { LoginFormValues } from '@app/schemas/auth';

// Styles
import { authStyles } from '@app/styles';

type LoginScreenProps = PublicStackScreenProps<typeof PUBLIC_SCREENS.LOGIN>;

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const initialValues = {
    [AUTH_FIELDS.IDENTIFIER]: '',
    [AUTH_FIELDS.PASSWORD]: '',
  };

  const { values, fieldErrors, handleChange, resetForm, setFieldError } =
    useForm({
      initialValues,
    });

  const { login, isSubmitting } = useAuthActions();

  const showToast = toastStore(state => state.showToast);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const validationResult = validateLogin(values as LoginFormValues);

    if (!validationResult.ok) {
      Object.entries(validationResult.errors).forEach(([field, error]) => {
        if (error) setFieldError(field as keyof LoginFormValues, error);
      });

      return;
    }

    try {
      await login(validationResult.payload);

      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.LOGIN_SUCCESS,
        position: POSITION.TOP,
      });

      resetForm();
    } catch (error) {
      showToast({
        type: STATUS.ERROR,
        message: getApiErrorMessage(error, ERROR_MESSAGES.REQUEST_FAILED),
        position: POSITION.TOP,
      });
    }
  }, [isSubmitting, values, setFieldError, login, showToast, resetForm]);

  return (
    <SafeAreaView style={authStyles.screen}>
      <AuthScreenLayout title={AUTH_FORM_MESSAGES.WELCOME_BACK}>
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.USERNAME_OR_EMAIL}
          value={values.identifier}
          onChangeText={text => handleChange(AUTH_FIELDS.IDENTIFIER, text)}
          leftIcon={<UserIcon width={20} height={20} />}
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
          leftIcon={<PassIcon width={20} height={20} />}
          isPassword
          error={fieldErrors.password}
          editable={!isSubmitting}
        />

        <TouchableOpacity
          style={authStyles.linkContainer}
          // Todo: Refactor to arrow function
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
          helperText={AUTH_FORM_MESSAGES.DONT_HAVE_AN_ACCOUNT}
          helperActionLabel={BUTTON_LABELS.REGISTER}
          disabled={isSubmitting}
          // Todo: Convert string to constant
          onHelperActionPress={() =>
            navigation.navigate(PUBLIC_SCREENS.REGISTER)
          }
        />
      </AuthScreenLayout>
    </SafeAreaView>
  );
};
