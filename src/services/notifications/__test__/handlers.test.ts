import { setupNotificationHandlers } from '../handlers';

describe('handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setupNotificationHandlers', () => {
    it('should return a callable unsubscribe function', () => {
      const unsub = setupNotificationHandlers();
      expect(typeof unsub).toBe('function');
      expect(() => unsub()).not.toThrow();
    });
  });
});
