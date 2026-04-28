import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const SortIcon = ({
  size = 24,
  color = colors.grayDark,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <G clipPath="url(#clip0_666_7810)">
      <Path
        d="M11.3247 12.0485V6.38386H9.66234V12.0485H7.16884L10.4935 15.2727L13.8182 12.0485H11.3247ZM5.5065 0.727295L2.18182 3.95154H4.67533V9.61618H6.33767V3.95154H8.83117L5.5065 0.727295ZM11.3247 12.0485V6.38386H9.66234V12.0485H7.16884L10.4935 15.2727L13.8182 12.0485H11.3247ZM5.5065 0.727295L2.18182 3.95154H4.67533V9.61618H6.33767V3.95154H8.83117L5.5065 0.727295Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_666_7810">
        <Rect width={size} height={size} fill={color} />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SortIcon;
