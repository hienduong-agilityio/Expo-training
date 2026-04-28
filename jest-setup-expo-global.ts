/**
 * Node.js 20 Jest (e.g. GitHub Actions ubuntu) has no global `WebSocket`.
 * In __DEV__, `expo/src/async-require/messageSocket.native.ts` does `new WebSocket(...)` at load time.
 */
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class JestWebSocketPolyfill {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    readonly CONNECTING = JestWebSocketPolyfill.CONNECTING;
    readonly OPEN = JestWebSocketPolyfill.OPEN;
    readonly CLOSING = JestWebSocketPolyfill.CLOSING;
    readonly CLOSED = JestWebSocketPolyfill.CLOSED;
    url: string;
    protocol = '';
    extensions = '';
    binaryType: BinaryType = 'blob';
    bufferedAmount = 0;
    readyState = JestWebSocketPolyfill.CLOSED;
    onopen: ((event: Event) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    constructor(url: string | URL, _protocols?: string | string[]) {
      this.url = typeof url === 'string' ? url : url.href;
    }
    close(_code?: number, _reason?: string): void {}
    send(_data: string | ArrayBufferLike | Blob | ArrayBufferView): void {}
    addEventListener(): void {}
    removeEventListener(): void {}
    dispatchEvent(): boolean {
      return false;
    }
  } as unknown as typeof WebSocket;
}

/** Minimal shape expo-modules-core reads from `globalThis.expo` in Jest. */
type ExpoNativeEventEmitterCtor = new () => {
  addListener(): { remove: () => void };
  removeListener(): void;
  removeAllListeners(): void;
  emit(): void;
};

type ExpoJestGlobals = {
  EventEmitter: ExpoNativeEventEmitterCtor;
  /** Populated so `requireNativeModule('…')` succeeds in Jest (no native binary). */
  modules: Record<string, Record<string, unknown>>;
};

/** Do not intersect with `typeof globalThis`: Expo’s typings merge `expo.EventEmitter` with a different constructor. */
const globalForJest = globalThis as unknown as {
  expo?: ExpoJestGlobals;
};

if (globalForJest.expo === undefined) {
  const noop = (): void => {};

  class MockExpoNativeEventEmitter {
    addListener(): { remove: () => void } {
      return { remove: noop };
    }
    removeListener(): void {}
    removeAllListeners(): void {}
    emit(): void {}
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
