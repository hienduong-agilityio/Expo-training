import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface ICustomStyles {
  // Generic containers
  container?: StyleProp<ViewStyle>;
  contentContainer?: StyleProp<ViewStyle>;

  // Text slots
  title?: StyleProp<TextStyle>;
  subtitle?: StyleProp<TextStyle>;
  labelText?: StyleProp<TextStyle>;
  message?: StyleProp<TextStyle>;
  actionText?: StyleProp<TextStyle>;
  closeText?: StyleProp<TextStyle>;

  // Containers layout
  labelContainer?: StyleProp<ViewStyle>;
  iconContainer?: StyleProp<ViewStyle>;
  accentBar?: StyleProp<ViewStyle>;
  messageContainer?: StyleProp<ViewStyle>;
  actionsContainer?: StyleProp<ViewStyle>;
  actionButton?: StyleProp<ViewStyle>;
  closeButton?: StyleProp<ViewStyle>;

  // Header
  headerTop?: StyleProp<ViewStyle>;
  logo?: StyleProp<ViewStyle>;
  profileButton?: StyleProp<ViewStyle>;
  menuButton?: StyleProp<ViewStyle>;

  itemContainer?: StyleProp<ViewStyle>;
}
