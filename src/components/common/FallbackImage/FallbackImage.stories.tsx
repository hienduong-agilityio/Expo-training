import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet } from 'react-native';

// Components
import { FallbackImage } from './index';

// Mocks
import { MOCK_IMAGE_SOURCES } from '@app/mocks/images';

// Themes
import { colors } from '@app/themes';

const meta: Meta<typeof FallbackImage> = {
  title: 'Components/Common/FallbackImage',
  component: FallbackImage,
};

export default meta;

type Story = StoryObj<typeof FallbackImage>;

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  imageContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
  },
  mediumImage: { width: 200, height: 200 },
});

export const Default: Story = {
  args: {
    source: MOCK_IMAGE_SOURCES.valid,
    style: styles.mediumImage,
  },
};

export const WithError: Story = {
  args: {
    source: MOCK_IMAGE_SOURCES.invalid,
    style: styles.mediumImage,
  },
};
