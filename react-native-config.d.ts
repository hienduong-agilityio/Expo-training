declare module 'react-native-config' {
  export interface NativeConfig {
    ENVIRONMENT?: string;
    API_BASE_URL?: string;
    STRAPI_BASE_URL?: string;
    REQUIRE_HTTPS?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
