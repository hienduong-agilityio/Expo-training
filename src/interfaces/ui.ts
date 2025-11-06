import { ReactNode } from 'react';

// Enums
import { BUTTON_VARIANTS } from '@app/enums';
import { BUTTON_COLORS } from '@app/enums';

// Types
import type {
  ImageProps,
  ImageSourcePropType,
  PressableProps,
  ViewStyle,
} from 'react-native';
import type { IProduct } from '@app/interfaces/product';

// Helpers
import { ComponentSize } from '@app/helpers/ui';

export interface IButtonProps extends Omit<PressableProps, 'children'> {
  label?: string;
  children?: ReactNode;
  variant?: BUTTON_VARIANTS;
  color?: BUTTON_COLORS;
  size?: ComponentSize;
  disabled?: boolean;
  selected?: boolean;
  fullWidth?: boolean;
}

export interface ILoadingButtonProps extends Omit<IButtonProps, 'label'> {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
}

export interface IStarsRatingProps {
  rating: number;
  maxRating?: number;
}

export interface IFallbackImageProps extends ImageProps {
  source?: ImageSourcePropType;
  fallbackSource?: ImageSourcePropType;
}

export interface IProductCardProps extends IProduct {
  testID?: string;
  style?: ViewStyle;
  isWishlisted?: boolean;
  onPress?: (id: string) => void;
  onWishlistToggle?: (id: string) => void;
}

export interface IOnboardingItem {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
}
