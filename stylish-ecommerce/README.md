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
cp .env.example .env.local


## A collection of AI agent skills for working with Expo projects and Expo Services
bunx skills add expo/skills

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

| Script                      | Description                               |
| --------------------------- | ----------------------------------------- |
| `yarn start`                | Start Expo development server             |
| `yarn start:clear`          | Start with cleared Metro cache            |
| `yarn ios`                  | Run on iOS simulator                      |
| `yarn android`              | Run on Android emulator                   |
| `yarn lint`                 | Check for linting errors                  |
| `yarn lint:fix`             | Auto-fix linting errors                   |
| `yarn format`               | Format code with Prettier                 |
| `yarn typecheck`            | Check TypeScript types                    |
| `yarn test`                 | Run tests                                 |
| `yarn test:coverage`        | Run tests with coverage                   |
| `yarn validate`             | Run all checks (typecheck + lint + test)  |
| `yarn prebuild`             | Generate native projects (CNG)            |
| `yarn storybook`            | Start app with Storybook as main UI       |
| `yarn storybook:web`        | Run Storybook for web (port 6006)         |
| `yarn build:web`            | Export main web app to `dist/`            |
| `yarn build:storybook:web`  | Build Storybook static site to `dist/`    |
| `yarn atlas`                | Build + open Atlas viewer (all platforms) |
| `yarn deploy:web`           | Deploy main web app → production URL      |
| `yarn deploy:storybook:web` | Deploy Storybook web → alias URL          |

## Web Deployment Guide

You have three separate web experiences, each managed independently so they **never overwrite each other**:

| #   | Target            | Build tool | URL                                               | How to run                  |
| --- | ----------------- | ---------- | ------------------------------------------------- | --------------------------- |
| 1   | **Main Web App**  | Metro/Expo | `https://<subdomain>.expo.app` (production)       | `yarn deploy:web`           |
| 2   | **Storybook Web** | Vite       | `https://<subdomain>--storybook.expo.app` (alias) | `yarn deploy:storybook:web` |
| 3   | **Expo Atlas**    | Local only | `http://localhost:5173` (dev tool)                | `yarn atlas`                |

### Why they do not conflict

EAS Hosting uses an **alias** system to keep deployments isolated:

- `eas deploy --prod` → production URL (main app)
- `eas deploy --alias storybook` → alias URL (storybook)

Each alias is a separate deployment. Deploying the main app **does not** affect Storybook, and vice versa.

Additionally, each script runs `rm -rf dist` before building to ensure a clean output directory with no leftover files.

---

### 1. Deploy Main Web App (Expo)

**Build:** `expo export --platform web` (Metro bundler)
**Output:** `dist/`
**Deploy:** EAS Hosting production URL

```bash
# Step 1: Build the web app
yarn build:web

# Step 2: Deploy to the production URL
eas deploy --prod

# Or in a single command:
yarn deploy:web
```

**EAS Workflow (CI):** Auto-deploys when pushing to `main`:

```bash
eas workflow:run .eas/workflows/deploy-web.yml
```

---

### 2. Deploy Storybook Web (Vite)

**Build:** `storybook build` (Vite bundler, reads config from `.storybook/main.ts`)
**Output:** `dist/`
**Deploy:** EAS Hosting alias `storybook`

> **Important:** Storybook web uses Vite, **not** Metro/Expo.
> The `storybook build -o dist` script builds an isolated Storybook UI.

```bash
# Step 1: Build the Storybook static site
yarn build:storybook:web

# Step 2: Deploy to the alias URL
eas deploy --alias storybook

# Or in a single command:
yarn deploy:storybook:web
```

**EAS Workflow (CI):**

```bash
eas workflow:run .eas/workflows/deploy-storybook-web.yml
```

> This workflow uses custom steps (not `type: deploy`) because Storybook requires a Vite build.
> If the workflow fails, fall back to the CLI: `yarn deploy:storybook:web`

---

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
