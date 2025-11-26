import { Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
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
  POSITION,
  PUBLIC_SCREENS,
  STATUS,
  TOAST_MESSAGES,
} from '@app/constants';

// Types
import type { PublicStackScreenProps } from '@app/interfaces';

// Styles
import { authStyles } from '@app/styles';

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
import { LoadingButton } from '@app/components/common/LoadingButton';

type LoginScreenProps = PublicStackScreenProps<typeof PUBLIC_SCREENS.LOGIN>;

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { values, fieldErrors, handleChange, resetForm, setFieldError } =
    useForm({
      initialValues: { identifier: '', password: '' },
    });

  const { showToast } = toastStore();
  const { login, isSubmitting } = useAuthActions();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validationResult = validateLogin(values as LoginFormValues);

    if (!validationResult.ok) {
      Object.entries(validationResult.errors).forEach(([field, error]) => {
        if (error) setFieldError(field, error);
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
        message: getApiErrorMessage(error, TOAST_MESSAGES.LOGIN_FAILED),
        position: POSITION.TOP,
      });
    }
  };

  return (
    <SafeAreaView style={authStyles.screen}>
      <AuthScreenLayout title={AUTH_FORM_MESSAGES.WELCOME_BACK}>
        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.USERNAME_OR_EMAIL}
          value={values.identifier}
          onChangeText={text => handleChange('identifier', text)}
          leftIcon={<UserIcon width={20} height={20} />}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={fieldErrors.identifier}
        />

        <AuthTextField
          placeholder={AUTH_FORM_MESSAGES.PASSWORD}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          leftIcon={<PassIcon width={20} height={20} />}
          isPassword
          error={fieldErrors.password}
        />

        <TouchableOpacity
          style={authStyles.linkContainer}
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
          onHelperActionPress={() =>
            navigation.navigate(PUBLIC_SCREENS.REGISTER)
          }
          onSocialSelect={() => {}}
        />
      </AuthScreenLayout>
    </SafeAreaView>
  );
};
