if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class {
    url: string;
    onmessage: null | ((message: { data: unknown }) => undefined) = null;

    constructor(url: string | URL) {
      this.url = typeof url === 'string' ? url : url.href;
    }

    close() {}
    send() {}
    addEventListener() {}
    removeEventListener() {}
  } as unknown as typeof WebSocket;
}

type ExpoNativeEventEmitterCtor = new () => {
  addListener(): { remove: () => undefined };
  removeListener(): undefined;
  removeAllListeners(): undefined;
  emit(): undefined;
};

type ExpoJestGlobals = {
  EventEmitter: ExpoNativeEventEmitterCtor;
  modules: Record<string, Record<string, unknown>>;
};

const globalForJest = globalThis as unknown as {
  expo?: ExpoJestGlobals;
};

if (globalForJest.expo === undefined) {
  function noop() {}

  class MockExpoNativeEventEmitter {
    addListener(): { remove: typeof noop } {
      return { remove: noop };
    }

    removeListener() {}
    removeAllListeners() {}
    emit() {}
  }

  globalForJest.expo = {
    EventEmitter:
      MockExpoNativeEventEmitter as unknown as ExpoNativeEventEmitterCtor,
    modules: {
      ExpoAsset: {
        downloadAsync: async () => 'file://mock-asset',
      },
      ExpoGlassEffect: {
        isLiquidGlassAvailable: false,
      },
      ExponentConstants: {
        name: 'StylishEcommerce',
        appOwnership: null,
        manifest: null,
      },
    },
  };
} else {
  const expo = globalForJest.expo;
  expo.modules = {
    ...(expo.modules ?? {}),
    ExpoAsset: {
      downloadAsync:
        expo.modules?.ExpoAsset?.downloadAsync ??
        (async () => 'file://mock-asset'),
    },
    ExpoGlassEffect: {
      isLiquidGlassAvailable:
        expo.modules?.ExpoGlassEffect?.isLiquidGlassAvailable ?? false,
    },
    ExponentConstants: {
      name: 'StylishEcommerce',
      appOwnership: null,
      manifest: null,
      ...(expo.modules?.ExponentConstants ?? {}),
    },
  };
}
