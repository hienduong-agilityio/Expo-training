import { memo, useState, useCallback } from 'react';
import FastImage, {
  type ResizeMode,
  type ImageStyle as FastImageStyle,
} from 'react-native-fast-image';
import type { ImageSourcePropType, StyleProp } from 'react-native';

// Types
import type { IFallbackImageProps } from '@app/interfaces';

// Mocks
import { FALLBACK_IMAGE } from '@app/mocks/images';

/**
 * Helper to convert ImageSourcePropType to FastImage source format
 */
const toFastImageSource = (source: ImageSourcePropType | undefined) => {
  if (!source) return undefined;

  if (typeof source === 'object' && 'uri' in source && source.uri) {
    return {
      uri: source.uri,
      priority: FastImage.priority.normal,
    };
  }

  if (typeof source === 'number') {
    return source;
  }

  return undefined;
};

/**
 * Map resizeMode string to FastImage resizeMode constant
 */
const mapResizeMode = (mode?: string): ResizeMode => {
  switch (mode) {
    case 'cover':
      return FastImage.resizeMode.cover;
    case 'contain':
      return FastImage.resizeMode.contain;
    case 'stretch':
      return FastImage.resizeMode.stretch;
    case 'center':
      return FastImage.resizeMode.center;
    default:
      return FastImage.resizeMode.cover;
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
  const fastImageSource = toFastImageSource(imageSource);

  // If we can't convert to FastImage source, use fallback
  if (!fastImageSource) {
    const fallbackFastSource = toFastImageSource(fallbackSource);

    return (
      <FastImage
        source={fallbackFastSource || FALLBACK_IMAGE}
        style={style as StyleProp<FastImageStyle>}
        resizeMode={mapResizeMode(resizeMode)}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      />
    );
  }

  return (
    <FastImage
      source={fastImageSource}
      style={style as StyleProp<FastImageStyle>}
      resizeMode={mapResizeMode(resizeMode)}
      onError={handleError}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
});
