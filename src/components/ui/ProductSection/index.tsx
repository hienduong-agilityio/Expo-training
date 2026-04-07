import { View } from 'react-native';

// Components
import { SectionContent } from './SectionContent';
import { PromoBanner } from '../PromoBanner';

// Types
import type { IProductSectionProps } from '@app/interfaces/ui';

// Styles
import { styles } from './index.style';

export const ProductSection = ({
  title,
  subtitle,
  products,
  Icon,
  label,
  loading,
  error,
  headerStyle = 'deal',
  actionLabel = 'View All',
  containerStyle,
  onPressViewAll,
  onItemPress,
  onWishlistToggle,
}: IProductSectionProps & {
  onWishlistToggle?: (id: string, isWishlisted: boolean) => void;
}) => {
  return (
    <View style={styles.section}>
      <View style={containerStyle}>
        <PromoBanner
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          label={label}
          headerStyle={headerStyle}
          actionLabel={actionLabel}
          onPressViewAll={onPressViewAll}
        />
      </View>
      <SectionContent
        products={products}
        loading={loading}
        error={error}
        onItemPress={onItemPress}
        onWishlistToggle={onWishlistToggle}
      />
    </View>
  );
};
