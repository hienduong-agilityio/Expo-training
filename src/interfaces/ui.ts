import { ReactNode } from 'react';

// Enums
import { BUTTON_VARIANTS, BUTTON_COLORS } from '@app/enums';

// Types
import type {
  ImageProps,
  ImageSourcePropType,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type { IProduct } from '@app/interfaces/product';
import type { ComponentType } from 'react';
import type { IconProps } from '@app/interfaces';
import type { ICustomStyles } from '@app/interfaces/style';

// Helpers
import { ComponentSize } from '@app/helpers/ui';

export type HeaderStyle = 'deal' | 'trending';

export interface IPromoBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  image: string;
  backgroundColor: string;
}

export interface ISaleBanner {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  image: string;
}

export interface IDealBadge {
  icon: string;
  text: string;
  color: string;
}

export interface IDealCountdown {
  text: string;
  color: string;
}

export interface IDealItem {
  title: string;
  subtitle?: string;
  badge?: IDealBadge;
  countdown?: IDealCountdown;
}

export interface IDealInfo {
  dealOfDay: IDealItem;
  weekendSpecial: IDealItem;
  trending: IDealItem;
  newArrivals: IDealItem;
}

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

export type TStatus = 'success' | 'error' | 'warning' | 'info';
export type TPosition = 'top' | 'bottom';

export interface INotFoundProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  retryLabel?: string;
  styleOverrides?: {
    container?: StyleProp<ViewStyle>;
    icon?: StyleProp<ViewStyle>;
    title?: StyleProp<TextStyle>;
    description?: StyleProp<TextStyle>;
    button?: StyleProp<ViewStyle>;
  };
  onRetry?: () => void;
}

export interface IIconConfig {
  Icon?: ComponentType<IconProps>;
  iconText?: string;
  dealInfo?: IDealInfo;
  iconContainerStyle?: ViewStyle;
}

export interface IContentConfig {
  products: IProductCardProps[];
  loading: boolean;
  error: Error | null;
  onItemPress?: (id: string) => void;
}

export interface IProductSectionProps
  extends IPromoBannerProps,
    IContentConfig {
  containerStyle?: ViewStyle;
}

export interface IPromoBannerProps {
  title: string;
  subtitle?: string;
  label?: string;
  Icon?: ComponentType<IconProps>;
  actionLabel?: string;
  showActionArrow?: boolean;
  headerStyle?: HeaderStyle;
  customStyle?: ICustomStyles;
  onPressViewAll?: () => void;
}
