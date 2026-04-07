import Svg, { Path } from 'react-native-svg';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const FilterIcon = ({
  size = 16,
  color = colors.black,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M14.6666 2H1.33331L6.66665 8.30667V12.6667L9.33331 14V11.1533V8.30667L14.6666 2Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M9.33335 8H6.66669V11.9111L9.33335 13.3333V8Z" fill={color} />
  </Svg>
);

export default FilterIcon;
