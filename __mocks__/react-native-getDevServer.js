/**
 * RN's getDevServer() reads NativeSourceCode.scriptURL, which is null in Jest.
 * Expo's async-require/messageSocket imports it under __DEV__ and crashes.
 * This stub matches the shape RN returns when the packager URL is known.
 */
module.exports = function getDevServer() {
  return {
    url: 'http://localhost:8081/',
    fullBundleUrl: 'http://localhost:8081/index.bundle?platform=ios&dev=true',
    bundleLoadedFromServer: true,
  };
};
