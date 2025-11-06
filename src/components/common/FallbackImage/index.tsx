import { useState } from 'react';

// Components
import { Image } from 'react-native';

// Types
import type { IFallbackImageProps } from '@app/interfaces';

// Mocks
import { FALLBACK_IMAGE } from '@app/mocks/images';

export const FallbackImage = ({
  source,
  fallbackSource = FALLBACK_IMAGE,
  style,
  ...props
}: IFallbackImageProps) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  const imageSource = !source || imageError ? fallbackSource : source;

  return (
    <Image
      source={imageSource}
      onError={handleError}
      style={style}
      {...props}
    />
  );
};
