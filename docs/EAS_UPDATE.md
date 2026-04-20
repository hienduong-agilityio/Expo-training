# EAS Update — First-time setup & quy trình chuẩn

> Doc chính thức: [https://docs.expo.dev/eas-update/introduction/](https://docs.expo.dev/eas-update/introduction/)

## 1. Mental model

```
┌─────────────────┐    ┌────────────┐    ┌─────────────┐    ┌──────────┐
│ Build (binary)  │ ── │  Channel   │ ── │   Branch    │ ── │ Updates  │
│ eas build       │    │ baked vào  │    │ trên server │    │ N updates│
│ --profile X     │    │ binary     │    │             │    │ / branch │
└─────────────────┘    └────────────┘    └─────────────┘    └──────────┘
```


| Khái niệm           | Vai trò                                                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime version** | Dấu vân tay binary. Policy `appVersion` ⇒ runtime = `package.json#version` lúc build/publish. **JS bundle chỉ phục vụ đúng runtime của binary.**               |
| **Channel**         | "Tên đài radio" baked vào binary lúc `eas build`. Build `--profile production` ⇒ channel `production`. KHÔNG đổi được sau khi build.                           |
| **Branch**          | Dòng update trên server. 1 channel có thể chuyển trỏ sang branch khác (qua `eas channel:edit`) ⇒ chuyển toàn bộ user sang nhóm update khác mà không build lại. |
| **Update**          | 1 JS bundle + assets, gắn với 1 runtime, nằm trong 1 branch.                                                                                                   |


**Server filter:** Khi 1 binary call về EAS, server tìm trong branch (mà channel đang trỏ tới) update có **runtime trùng với binary**. Không match ⇒ không có update ⇒ giữ bundle hiện tại.

## 2. Cấu hình hiện tại

- `app.config.js` — `runtimeVersion.policy: 'appVersion'`, `updates.checkAutomatically: 'ON_ERROR_RECOVERY'`, `fallbackToCacheTimeout: 0`.
- `eas.json` — 3 build profile (`development`, `preview`, `production`), mỗi profile baked đúng channel cùng tên.
- Channel ↔ Branch mapping (mặc định 1:1):
  - `development` → `development`
  - `preview` → `preview`
  - `production` → `production`
- App-side:
  - `useOTAUpdate` (`src/hooks/useOTAUpdate.ts`) — auto-check khi cold-start + resume, fetch ngầm, prompt non-blocking, hỗ trợ `isCritical` flag.
  - `UpdatePrompt` (`src/components/UpdatePrompt`) — modal "Restart now / Later".
  - `RuntimeBadge` (`src/components/RuntimeBadge`) — overlay góc dưới phải, hiện ở `__DEV__` / channel `development` / `preview` để QA verify đúng runtime + updateId.

## 3. Quy trình chuẩn (preview → production)

```
[1] git feature branch
       │
       │ MR review + merge
       ▼
[2] commit clean trên main
       │
       │ yarn eas:update:preview
       ▼
[3] update xuất hiện ở branch `preview`
       │
       │ QA cài preview build → mở app → RuntimeBadge verify:
       │   runtime = đúng version, channel = preview, updateId = đúng
       │   Test flow chính
       ▼
[4] QA pass
       │
       │ yarn eas:update:promote
       │   (= eas update:republish --branch preview --destination-branch production)
       ▼
[5] update y hệt được copy sang branch `production`
       │
       │ user cài production build → app auto check → fetch → UpdatePrompt
       ▼
[6] Done
```

### Lệnh từng bước

```bash
# Trước khi publish: verify trạng thái hiện tại
yarn eas:update:status

# Bước [2]→[3]: publish lên preview (script tự verify working tree clean)
yarn eas:update:preview

# Bước [4]→[5]: promote update đã verified sang production (KHÔNG bundle lại)
yarn eas:update:promote

# Nếu phát hiện lỗi sau bước [5]
yarn eas:update:rollback
```

> `update:republish` lấy đúng artifact (bundle + assets + manifest) đã được QA test trên preview, copy sang branch `production`. KHÔNG re-bundle JS ⇒ không có rủi ro state build khác giữa 2 lần.

## 4. Khi nào cần build binary mới (không thể OTA)

Bắt buộc build lại + bump `package.json#version` khi:

- Thay đổi `ios/`, `android/` (native code).
- Add/remove dependency có native module (autolinked: `react-native-*`, đa số `expo-*`).
- Thay đổi `app.config.js` plugins (vd: thêm `expo-build-properties` config).
- Thay đổi `runtimeVersion`, scheme, bundle identifier, package name.
- Bump Expo SDK.

Audit nhanh:

```bash
git diff <last-binary-tag>..HEAD -- ios android app.config.js yarn.lock
```

Chỉ thấy diff ở `src/`, `app/`, JS-only deps ⇒ OTA an toàn. Có diff ở các path trên ⇒ phải build binary mới.

## 5. Critical update (force reload ngay)

```bash
yarn eas:update:preview --extra-metadata '{"isCritical":true,"releaseNotes":"Fix crash on checkout"}'
```

Hook `useOTAUpdate` đọc `manifest.extra.isCritical` ⇒ tự `Updates.reloadAsync()` thay vì hiện prompt.

## 6. Verify trên thiết bị

- `**RuntimeBadge**` ở góc dưới phải — tap để xem `runtimeVersion`, `channel`, `updateId`, `createdAt`, `isEmbeddedLaunch`.
- Console log `[OTA] runtime info {...}` ở lần boot đầu — nên forward vào Sentry/Datadog tag (chưa setup).

## 7. Trace update ↔ git commit

Mỗi update trên dashboard đều có `gitCommitHash`. Script publish của repo này set `--message "<short-sha> <commit subject>"` ⇒ mở dashboard có thể đối chiếu nhanh.

```bash
# Tìm commit từ updateId
eas update:view <updateId>
```

## 8. Hiện trạng dashboard hiện tại (snapshot)


| Channel       | Branch        | Latest runtime | Note                                   |
| ------------- | ------------- | -------------- | -------------------------------------- |
| `production`  | `production`  | 0.0.2          | có cả update rt 1.0.0 (rác cũ) + 0.0.1 |
| `preview`     | `preview`     | 0.0.2          | có cả update rt 1.0.0 (rác cũ) + 0.0.1 |
| `development` | `development` | (trống)        | OK                                     |


> Updates rt `1.0.0` không gây hại (không có binary nào ở user có rt 1.0.0 ⇒ server không serve), nhưng nên ignore khi đọc dashboard. Có thể delete từ web dashboard nếu muốn dọn sạch.

## 9. Checklist trước khi `yarn eas:update:preview`

- Code đã merge vào branch chính qua MR review.
- Working tree clean (`git status`).
- HEAD đã push lên remote (script sẽ warn nếu local-only).
- Đã chạy `yarn lint:check && yarn test` local.
- Diff so với binary gần nhất KHÔNG đụng `ios/`, `android/`, `app.config.js` plugins, `yarn.lock` native deps.
- Đã `yarn eas:update:status` để biết trạng thái dashboard.

## 10. Checklist trước khi `yarn eas:update:promote`

- QA team đã cài preview build và verify qua `RuntimeBadge`:
  - `runtimeVersion` đúng.
  - `updateId` khớp với update vừa publish trên preview.
  - Flow chính (login, checkout, push notification, ...) đều pass.
- Update trên preview đã chạy ≥ 24h không có crash report mới (nếu đã có Sentry).
- Có người sẵn sàng monitor sau promote (rollback nếu cần).

