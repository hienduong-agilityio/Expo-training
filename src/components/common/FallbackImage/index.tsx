import { memo, useState, useCallback } from 'react';
import { Image, type ImageContentFit } from 'expo-image';
import type { ImageSourcePropType, StyleProp, ImageStyle } from 'react-native';

// Types
import type { IFallbackImageProps } from '@app/interfaces';

// Mocks
import { FALLBACK_IMAGE } from '@app/mocks/images';

const toExpoSource = (source: ImageSourcePropType | undefined) => {
  if (!source) return undefined;

  if (typeof source === 'object' && 'uri' in source && source.uri) {
    return { uri: source.uri };
  }

  if (typeof source === 'number') {
    return source;
  }

  return undefined;
};

const mapResizeModeToContentFit = (mode?: string): ImageContentFit => {
  switch (mode) {
    case 'cover':
      return 'cover';
    case 'contain':
      return 'contain';
    case 'stretch':
      return 'fill';
    case 'center':
      return 'contain';
    default:
      return 'cover';
  }
};

export const FallbackImage = memo(function FallbackImage({
  source,
  fallbackSource = FALLBACK_IMAGE,
  style,
  resizeMode,
  accessibilityLabel,
  testID,
}: IFallbackImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  const imageSource = !source || imageError ? fallbackSource : source;
  const expoSource = toExpoSource(imageSource);
  const contentFit = mapResizeModeToContentFit(resizeMode);

  if (!expoSource) {
    const fallbackExpo = toExpoSource(fallbackSource);

    return (
      <Image
        source={fallbackExpo || FALLBACK_IMAGE}
        style={style as StyleProp<ImageStyle>}
        contentFit={contentFit}
        priority="normal"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      />
    );
  }

  return (
    <Image
      source={expoSource}
      style={style as StyleProp<ImageStyle>}
      contentFit={contentFit}
      priority="normal"
      onError={handleError}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
});
