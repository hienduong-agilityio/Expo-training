// Services
import { syncFcmToken } from '@app/services/user';
import { apiRequest } from '@app/services/apiClient';

// Constants
import { USER_ENDPOINTS, HTTP_METHODS } from '@app/constants/api';

jest.mock('@app/services/apiClient', () => ({
  apiRequest: jest.fn(),
}));

describe('user service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new device token when none exists for device + platform', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({});

    await syncFcmToken('user-1', 'fcm-token-xyz');

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      USER_ENDPOINTS.DEVICE_TOKEN,
      expect.objectContaining({
        method: HTTP_METHODS.GET,
        auth: true,
      }),
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      USER_ENDPOINTS.DEVICE_TOKEN,
      expect.objectContaining({
        method: HTTP_METHODS.POST,
        body: {
          data: expect.objectContaining({
            token: 'fcm-token-xyz',
            users_permissions_users: ['user-1'],
            deviceId: 'mock-ios-idfv',
            platform: 'ios',
          }),
        },
        auth: true,
      }),
    );
  });

  it('updates existing token and links user when not yet linked', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({
        data: [
          {
            documentId: 'entry-1',
            users_permissions_users: [{ id: 10, documentId: 'u10' }],
          },
        ],
      })
      .mockResolvedValueOnce({});

    await syncFcmToken(99, 'new-token');

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      `${USER_ENDPOINTS.DEVICE_TOKEN}/entry-1`,
      expect.objectContaining({
        method: HTTP_METHODS.PUT,
        body: {
          data: expect.objectContaining({
            token: 'new-token',
            users_permissions_users: ['u10', 99],
          }),
        },
        auth: true,
      }),
    );
  });

  it('updates existing token without duplicating linked user', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({
        data: [
          {
            documentId: 'entry-2',
            users_permissions_users: [{ id: 5, documentId: 'doc-five' }],
          },
        ],
      })
      .mockResolvedValueOnce({});

    await syncFcmToken(5, 'same-user-token');

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      `${USER_ENDPOINTS.DEVICE_TOKEN}/entry-2`,
      expect.objectContaining({
        method: HTTP_METHODS.PUT,
        body: {
          data: expect.objectContaining({
            users_permissions_users: ['doc-five'],
          }),
        },
      }),
    );
  });

  it('matches linked user by documentId string', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({
        data: [
          {
            documentId: 'entry-3',
            users_permissions_users: [{ id: 7, documentId: 'match-me' }],
          },
        ],
      })
      .mockResolvedValueOnce({});

    await syncFcmToken('match-me', 'tok');

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      `${USER_ENDPOINTS.DEVICE_TOKEN}/entry-3`,
      expect.objectContaining({
        body: {
          data: expect.objectContaining({
            users_permissions_users: ['match-me'],
          }),
        },
      }),
    );
  });
});
