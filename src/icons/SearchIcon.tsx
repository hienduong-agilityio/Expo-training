import Svg, { Path } from 'react-native-svg';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';

const SearchIcon = ({
  size = 24,
  color = colors.grayDark,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 20.9999L16.65 16.6499"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SearchIcon;
