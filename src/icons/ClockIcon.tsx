import Svg, { Path } from 'react-native-svg';

// Types
import { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const ClockIcon = ({
  size = 16,
  color = colors.black,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 5v3l2 2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ClockIcon;
