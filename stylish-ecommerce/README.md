# Expo Training Repo

A production-ready [Expo](https://expo.dev) React Native project with best practices.

## Features

- **Expo SDK 55** with New Architecture enabled
- **TypeScript** with strict mode
- **ESLint** + **Prettier** for code quality
- **Husky** + **lint-staged** for git hooks
- **Commitlint** for conventional commits
- **Jest** + **Testing Library** for testing
- **Storybook** for component development
- Light/Dark theme support
- Reusable UI components
- API service with error handling
- Custom hooks library

## Quick Start

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env

# Start development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Project Structure

```app/
├── components/       # Reusable UI components
│   ├── ui/          # Button, Text, Input, Card, etc.
│   └── layout/      # Container, Screen layouts
├── constants/       # Colors, spacing, typography, config
├── hooks/           # Custom React hooks
├── services/        # API client
├── types/           # TypeScript types
├── utils/           # Helper functions
├── _layout.tsx      # Root layout
└── index.tsx        # Home screen
```

## Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `yarn start`         | Start Expo development server            |
| `yarn start:clear`   | Start with cleared Metro cache           |
| `yarn ios`           | Run on iOS simulator                     |
| `yarn android`       | Run on Android emulator                  |
| `yarn lint`          | Check for linting errors                 |
| `yarn lint:fix`      | Auto-fix linting errors                  |
| `yarn format`        | Format code with Prettier                |
| `yarn typecheck`     | Check TypeScript types                   |
| `yarn test`          | Run tests                                |
| `yarn test:coverage` | Run tests with coverage                  |
| `yarn validate`      | Run all checks (typecheck + lint + test) |
| `yarn prebuild`      | Generate native projects (CNG)           |
| `yarn storybook`     | Start app with Storybook as main UI      |
| `yarn storybook:web`       | Run Storybook for web (port 6006)         |
| `yarn build:web`           | Export main web app to `dist/`            |
| `yarn build:storybook:web` | Build Storybook static site to `dist/`    |
| `yarn atlas`               | Build + open Atlas viewer (all platforms) |
| `yarn deploy:web`          | Deploy main web app → production URL      |
| `yarn deploy:storybook:web`| Deploy Storybook web → alias URL          |

## Web Deployment Guide (3 targets, isolated)

Ba bản web được quản lý riêng biệt, **không đè lên nhau**:

| # | Target              | Build tool | URL                                              | Cách chạy                   |
|---|---------------------|------------|--------------------------------------------------|-----------------------------|
| 1 | **Main Web App**    | Metro/Expo | `https://<subdomain>.expo.app` (production)      | `yarn deploy:web`           |
| 2 | **Storybook Web**   | Vite       | `https://<subdomain>--storybook.expo.app` (alias)| `yarn deploy:storybook:web` |
| 3 | **Expo Atlas**      | Local only | `http://localhost:5173` (dev tool)               | `yarn atlas`                             |

### Tại sao không bị đè lên nhau?

EAS Hosting dùng hệ thống **alias** để tách biệt các deployment:
- `eas deploy --prod` → production URL (main app)
- `eas deploy --alias storybook` → alias URL (storybook)

Mỗi alias là một deployment riêng biệt. Deploy main app **không** ảnh hưởng storybook và ngược lại.

Thêm vào đó, mỗi script đã có `rm -rf dist` để xoá sạch output trước khi build, tránh file thừa từ bản trước.

---

### 1. Deploy Main Web App (Expo)

**Build:** `expo export --platform web` (Metro bundler)
**Output:** `dist/`
**Deploy:** EAS Hosting production URL

```bash
# Bước 1: Build web app
yarn build:web
# → rm -rf dist && expo export --platform web
# → Output: dist/

# Bước 2: Deploy lên production URL
eas deploy --prod

# Hoặc chạy 1 lệnh:
yarn deploy:web
```

**EAS Workflow (CI):** Auto-deploy khi push lên `main`:
```bash
eas workflow:run .eas/workflows/deploy-web.yml
```

---

### 2. Deploy Storybook Web (Vite)

**Build:** `storybook build` (Vite bundler, đọc config từ `.storybook/main.ts`)
**Output:** `dist/`
**Deploy:** EAS Hosting alias `storybook`

> **Quan trọng:** Storybook web dùng Vite, KHÔNG phải Metro/Expo.
> Script `storybook build -o dist` build Storybook UI riêng biệt.

```bash
# Bước 1: Build Storybook static site
yarn build:storybook:web
# → rm -rf dist && storybook build -o dist
# → Output: dist/ (Storybook UI, không phải Expo app)

# Bước 2: Deploy lên alias URL
eas deploy --alias storybook

# Hoặc chạy 1 lệnh:
yarn deploy:storybook:web
```

**EAS Workflow (CI):**
```bash
eas workflow:run .eas/workflows/deploy-storybook-web.yml
```
> Workflow này dùng custom steps (không phải `type: deploy`) vì Storybook cần Vite build.
> Nếu workflow fail, dùng CLI: `yarn deploy:storybook:web`

---

### 3. Expo Atlas (Native Bundle Analysis — Local Only)

**Mục đích:** Phân tích kích thước JS bundle cho **Android** và **iOS** (native).
**Build + View:** Chỉ 1 lệnh duy nhất.

> Expo Atlas là dev tool chạy local, **không deploy lên hosting**.
> Nó phân tích JS bundle mà Metro tạo ra cho từng platform native.
> Atlas CLI chỉ hỗ trợ chạy server (không có static export).

```bash
# 1 lệnh duy nhất: clean → export all platforms → open viewer
yarn atlas
# → rm -rf .expo/atlas
# → EXPO_ATLAS=1 expo export --platform all (Android + iOS + Web)
# → npx expo-atlas
# → Mở trình duyệt: http://localhost:5173
# → Chọn platform (android/ios/web) để xem chi tiết bundle
```

**Atlas giúp bạn:**
- Xem kích thước từng module/package trong bundle
- Tìm dependencies nặng cần optimize
- So sánh bundle size giữa Android và iOS

---

### Tóm tắt: Các bản deploy hoàn toàn độc lập

```
┌─────────────────┐     ┌─────────────────┐     ┌───────────────────┐
│  Main Web App   │     │  Storybook Web  │     │    Expo Atlas     │
│                 │     │                 │     │  (Native Bundle)  │
│ Build: Metro    │     │ Build: Vite     │     │ EXPO_ATLAS=1      │
│ expo export     │     │ storybook build │     │ expo export       │
│ --platform web  │     │   -o dist       │     │ --platform all    │
│       ↓         │     │       ↓         │     │       ↓           │
│   dist/         │     │   dist/         │     │  .expo/atlas/     │
│       ↓         │     │       ↓         │     │       ↓           │
│ eas deploy      │     │ eas deploy      │     │  npx expo-atlas   │
│   --prod        │     │   --alias sb    │     │       ↓           │
│       ↓         │     │       ↓         │     │ localhost:5173    │
│ <slug>.expo.app │     │ <slug>--sb.     │     │                   │
│                 │     │   expo.app      │     │                   │
└─────────────────┘     └─────────────────┘     └───────────────────┘
      DEPLOYED               DEPLOYED              LOCAL ONLY
      (isolated)             (isolated)       (no static export CLI)
```

## Storybook (Android)

Setup follows [Expo’s Storybook guide](https://expo.dev/blog/storybook-and-expo). Storybook is available:

- **In dev:** run `yarn start`, then use the Expo dev menu → “Toggle Storybook”.
- **Storybook-only mode:** run `yarn storybook` (sets `EXPO_PUBLIC_ENVIRONMENT=storybook`); the app opens directly into Storybook.

**Android internal build (APK) for sharing:**

- Build: `eas build -p android --profile storybook`
- The Storybook build uses package `com.hienduong.stylishecommerce.storybook` so it can be installed alongside the main app.
- After the build, use the EAS link or QR code to install the APK on devices.

iOS/TestFlight is not configured for Storybook in this project.

## Documentation

See [docs/PROJECT_SETUP.md](./docs/PROJECT_SETUP.md) for detailed documentation on:

- All configuration files explained
- App structure and architecture
- Best practices and conventions
- Component usage examples

## Tech Stack

| Category   | Technology                   |
| ---------- | ---------------------------- |
| Framework  | Expo SDK 55                  |
| Language   | TypeScript                   |
| Navigation | Expo Router                  |
| Styling    | React Native StyleSheet      |
| State      | React Hooks                  |
| Animation  | React Native Reanimated      |
| Gestures   | React Native Gesture Handler |
| Testing    | Jest + Testing Library       |
| Linting    | ESLint + Prettier            |
| Git Hooks  | Husky + lint-staged          |

## Troubleshooting

### "Unable to activate keep awake" / construct.js errors

This comes from Expo’s internal use of `expo-keep-awake` in dev tools (not from app code), often when the app is backgrounded or Expo Go keeps the screen awake. The app **suppresses** these errors in the entry point and via LogBox.

- If the red box still appears, start with a clean cache: `yarn start:clear`.
- If it persists, do a full clean: remove `node_modules`, reinstall, then start with clear cache:

  ```bash
  rm -rf node_modules && yarn install && yarn start:clear
  ```

- Safe to ignore in development; it does not affect production builds.

## Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Commit using conventional commits: `git commit -m "feat: add new feature"`
4. Push and create a Pull Request

## License

Private
