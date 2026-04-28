import {
  setupNotificationHandlers,
  setupBackgroundNotificationHandler,
} from '../handlers';

describe('handlers', () => {
  describe('setupNotificationHandlers', () => {
    it('returns a callable unsubscribe function', () => {
      const unsub = setupNotificationHandlers();
      expect(typeof unsub).toBe('function');
      expect(unsub()).toBeUndefined();
    });

    it('accepts optional callback (stub implementation)', () => {
      const onPress = jest.fn();
      const unsub = setupNotificationHandlers(onPress);
      expect(typeof unsub).toBe('function');
    });
  });

  describe('setupBackgroundNotificationHandler', () => {
    it('returns undefined', () => {
      expect(setupBackgroundNotificationHandler()).toBeUndefined();
    });
  });
});
