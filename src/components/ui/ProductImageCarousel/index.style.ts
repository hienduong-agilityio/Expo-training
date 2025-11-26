import { StyleSheet, Dimensions } from 'react-native';

// Themes
import { colors, spacing } from '@app/themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.75; // 4:3 aspect ratio

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.surface,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
  },
  scrollView: {
    width: '100%',
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: colors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    paddingVertical: spacing['2'],
  },
});
