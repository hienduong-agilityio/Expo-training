import Svg, { Circle, Path } from 'react-native-svg';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const InfoIcon = ({ size = 24, color = colors.info, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
    <Path d="M12 10V16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M12 8.01L12.01 8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default InfoIcon;
