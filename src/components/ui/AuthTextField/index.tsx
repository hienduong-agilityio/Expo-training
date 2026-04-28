import { useState } from 'react';
import type { TextInputProps } from 'react-native';

// Components
import { TextField } from '@app/components/common/TextField';

// Enums
import { TEXTFIELD_VARIANTS } from '@app/enums';

// Icons
import { EyeOpenIcon, EyeCloseIcon } from '@app/icons';

interface IAuthTextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const AuthTextField = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  ...props
}: IAuthTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      label={label}
      error={error}
      leftIcon={leftIcon}
      {...props}
      {...(isPassword && {
        type: showPassword ? 'text' : 'password',
        isSecureText: !showPassword,
        rightIcon: showPassword ? (
          <EyeCloseIcon width={20} height={20} />
        ) : (
          <EyeOpenIcon width={20} height={20} />
        ),
        onRightPress: () => setShowPassword(!showPassword),
      })}
      variant={TEXTFIELD_VARIANTS.FILLED}
      size="lg"
    />
  );
};
