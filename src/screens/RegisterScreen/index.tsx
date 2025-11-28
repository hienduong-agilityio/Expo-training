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
  POSITION,
  PUBLIC_SCREENS,
  STATUS,
  TOAST_MESSAGES,
} from '@app/constants';
import { AUTH_FIELDS } from '@app/constants/auth';

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
import { validateRegister } from '@app/helpers/validation';

// Schemas
import { RegisterFormValues } from '@app/schemas/auth';

type RegisterScreenProps = PublicStackScreenProps<
  typeof PUBLIC_SCREENS.REGISTER
>;

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const { values, fieldErrors, handleChange, resetForm, setFieldError } =
    useForm({
      initialValues: {
        [AUTH_FIELDS.USERNAME]: '',
        [AUTH_FIELDS.EMAIL]: '',
        [AUTH_FIELDS.PASSWORD]: '',
        [AUTH_FIELDS.CONFIRM_PASSWORD]: '',
      },
    });

  const showToast = toastStore(state => state.showToast);

  const { register, isSubmitting } = useAuthActions();

  const navigateToLogin = () => navigation.navigate(PUBLIC_SCREENS.LOGIN);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validationResult = validateRegister(values as RegisterFormValues);

    if (!validationResult.ok) {
      Object.entries(validationResult.errors).forEach(([field, error]) => {
        if (error) setFieldError(field, error);
      });

      return;
    }

    try {
      await register(validationResult.payload);

      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.REGISTER_SUCCESS,
        position: POSITION.TOP,
      });

      resetForm();
      setTimeout(navigateToLogin, NAVIGATION_DELAYS.AFTER_REGISTER);
    } catch (error) {
      showToast({
        type: STATUS.ERROR,
        message: getApiErrorMessage(error, TOAST_MESSAGES.REQUEST_FAILED),
        position: POSITION.TOP,
      });
    }
  };

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
          helperText={AUTH_FORM_MESSAGES.DONT_HAVE_AN_ACCOUNT}
          helperActionLabel={BUTTON_LABELS.LOGIN}
          onHelperActionPress={navigateToLogin}
        />
      </AuthScreenLayout>
    </SafeAreaView>
  );
};
