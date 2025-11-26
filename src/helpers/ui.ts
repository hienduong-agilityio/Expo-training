// Helpers
import { BUTTON_COLORS, BUTTON_VARIANTS } from '@app/enums';

// Themes
import { colors, spacing, typography } from '@app/themes';

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ControlColor = BUTTON_COLORS;

export type SizeMetrics = {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
};

export type ColorPalette = {
  background: string;
  foreground: string;
  onBackground: string;
  borderColor: string;
};

export type ButtonStyleConfig = {
  containerStyle: {
    backgroundColor?: string;
    borderColor: string;
    borderWidth: number;
  };
  labelStyle: {
    color: string;
  };
  isSolid: boolean;
};

export const sizeMetricsBySize: Record<ComponentSize, SizeMetrics> = {
  sm: {
    height: spacing[9],
    paddingHorizontal: spacing[3],
    fontSize: typography.fontSizes.xs,
  },
  md: {
    height: spacing[11],
    paddingHorizontal: spacing[4],
    fontSize: typography.fontSizes.base,
  },
  lg: {
    height: spacing[13],
    paddingHorizontal: spacing[5],
    fontSize: typography.fontSizes.md,
  },
};

export function getSizeMetrics(size: ComponentSize = 'md'): SizeMetrics {
  return sizeMetricsBySize[size];
}

export const getColorPalette = (color: ControlColor): ColorPalette => {
  switch (color) {
    case BUTTON_COLORS.PRIMARY:
      return {
        background: colors.primary,
        foreground: colors.primary,
        onBackground: colors.textOnPrimary,
        borderColor: colors.primary,
      };

    case BUTTON_COLORS.NEUTRAL:
    default:
      return {
        background: colors.surface,
        foreground: colors.text,
        onBackground: colors.text,
        borderColor: colors.border,
      };
  }
};

export const sizeMetrics = sizeMetricsBySize;

export function getButtonStyles(variant: BUTTON_VARIANTS): ButtonStyleConfig {
  switch (variant) {
    case BUTTON_VARIANTS.SOLID:
      return {
        containerStyle: {
          backgroundColor: colors.primary,
          borderColor: colors.border,
          borderWidth: 1,
        },
        labelStyle: {
          color: colors.textOnPrimary,
        },
        isSolid: true,
      };

    case BUTTON_VARIANTS.OUTLINE:
      return {
        containerStyle: {
          borderColor: colors.border,
          borderWidth: 1,
        },
        labelStyle: {
          color: colors.text,
        },
        isSolid: false,
      };

    case BUTTON_VARIANTS.GHOST:
      return {
        containerStyle: {
          borderColor: 'transparent',
          borderWidth: 1,
        },
        labelStyle: {
          color: colors.text,
        },
        isSolid: false,
      };

    default:
      return {
        containerStyle: {
          backgroundColor: 'transparent',
          borderColor: colors.border,
          borderWidth: 1,
        },
        labelStyle: {
          color: colors.text,
        },
        isSolid: false,
      };
  }
}
