import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light-background',
      values: [
        { name: 'light-background', value: '#FFFFFF' },
        { name: 'dark-background', value: '#222222' },
      ],
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withBackgrounds],
};

export default preview;
