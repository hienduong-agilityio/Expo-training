import { initializeNotificationChannels } from '../channels';

describe('channels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeNotificationChannels', () => {
    it('should resolve without throwing', async () => {
      await expect(initializeNotificationChannels()).resolves.not.toThrow();
    });
  });
});
