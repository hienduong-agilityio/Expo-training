import Svg, { Path } from 'react-native-svg';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const LayersIcon = ({
  size = 24,
  color = colors.black,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 21" fill="none" {...props}>
    <Path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L12 17L22 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LayersIcon;
