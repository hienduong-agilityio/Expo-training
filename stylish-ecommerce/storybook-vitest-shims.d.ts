declare module '@storybook/react-native-web-vite' {
  export type Meta<T> = any;
  export type StoryObj<T> = any;
  export type Preview = any;
}

declare module '@storybook/addon-vitest/vitest-plugin' {
  export function storybookTest(options: any): any;
}

declare module 'vitest/config' {
  export function defineConfig(config: any): any;
}

declare module '@vitest/browser-playwright' {
  export function playwright(options: any): any;
}

