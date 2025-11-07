import Svg, { Circle, Path } from 'react-native-svg';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const ErrorIcon = ({
  size = 24,
  color = colors.error,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
    <Path
      d="M9 9L15 15M15 9L9 15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ErrorIcon;
