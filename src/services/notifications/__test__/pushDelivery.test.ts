import {
  buildStableScheduleIdentifierFromTitleAndBody,
  getPushMessageIdentityKey,
  shouldSkipRepeatedForegroundBanner,
  shouldSkipRepeatedRemotePush,
} from '../firebase';

describe('firebase cloud messaging (Expo)', () => {
  it('skips the second delivery when the same FCM message id is seen twice', () => {
    const notification = {
      date: Date.now(),
      request: {
        identifier: '1',
        content: { title: 't', body: 'b', data: {} },
        trigger: {
          type: 'push' as const,
          remoteMessage: { messageId: 'mid-abc' },
        },
      },
    };

    expect(shouldSkipRepeatedRemotePush(notification as never)).toBe(false);
    expect(shouldSkipRepeatedRemotePush(notification as never)).toBe(true);
  });

  it('does not skip when no push identity exists', () => {
    const notification = {
      date: Date.now(),
      request: {
        identifier: '1',
        content: { title: 't', body: 'b', data: {} },
        trigger: { type: 'unknown' as const },
      },
    };

    expect(shouldSkipRepeatedRemotePush(notification as never)).toBe(false);
    expect(shouldSkipRepeatedRemotePush(notification as never)).toBe(false);
  });

  it('skips repeated title and body within the foreground window', () => {
    expect(shouldSkipRepeatedForegroundBanner('Hello', 'World')).toBe(false);
    expect(shouldSkipRepeatedForegroundBanner('Hello', 'World')).toBe(true);
  });

  it('does not treat different bodies as repeats under the same title', () => {
    expect(shouldSkipRepeatedForegroundBanner('Hi', 'A')).toBe(false);
    expect(shouldSkipRepeatedForegroundBanner('Hi', 'B')).toBe(false);
  });

  it('reads identity from the push trigger remoteMessage', () => {
    const notification = {
      request: {
        content: { data: {} },
        trigger: {
          type: 'push' as const,
          remoteMessage: { messageId: 'x' },
        },
      },
    };
    expect(getPushMessageIdentityKey(notification as never)).toBe('fcm:x');
  });

  it('buildStableScheduleIdentifierFromTitleAndBody is stable for the same input', () => {
    expect(buildStableScheduleIdentifierFromTitleAndBody('a', 'b')).toBe(
      buildStableScheduleIdentifierFromTitleAndBody('a', 'b'),
    );
  });
});
