import Svg, { Path, Polygon } from 'react-native-svg';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const WarningIcon = ({
  size = 24,
  color = colors.warning,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Polygon
      points="12,3 22,21 2,21"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M12 9V13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M12 17.01L12.01 17"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default WarningIcon;
