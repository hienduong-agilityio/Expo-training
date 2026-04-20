# EAS Update — Operator's handbook

> One-stop reference for shipping OTA updates safely.
> Official docs: <https://docs.expo.dev/eas-update/introduction/>

---

## TL;DR — daily commands

```bash
yarn eas:update:status        # see channels, branches, recent updates
yarn eas:update:preview       # publish current commit to `preview`
yarn eas:update:promote       # republish preview → production (no rebundle)
yarn eas:update:rollback      # revert production to the previous update
```

**Golden rule:** never publish straight to `production`. Always go `preview → QA → promote`.

---

## 1. Mental model

```
┌─────────────────┐    ┌────────────┐    ┌─────────────┐    ┌──────────┐
│ Build (binary)  │ ── │  Channel   │ ── │   Branch    │ ── │ Updates  │
│ eas build       │    │ baked into │    │ lives on    │    │ N per    │
│ --profile X     │    │ the binary │    │ the server  │    │ branch   │
└─────────────────┘    └────────────┘    └─────────────┘    └──────────┘
```

| Concept             | Meaning                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Runtime version** | Fingerprint of the native binary. Policy `appVersion` ⇒ runtime = `package.json#version` at publish time.                                              |
| **Channel**         | Name baked into the binary at `eas build`. Cannot change after the binary ships.                                                                       |
| **Branch**          | A stream of updates on the EAS server. A channel can be repointed to a different branch via `eas channel:edit`.                                        |
| **Update**          | One JS bundle + assets, tied to a runtime, sitting inside one branch.                                                                                  |

**Server matching rule:** when a binary polls EAS, the server looks inside the branch its channel points to and serves the latest update **whose runtime matches the binary's runtime**. No match ⇒ the binary keeps its current bundle.

> Consequence: an update published with `package.json#version=0.0.1` will only ever reach binaries built with `version=0.0.1`. Binaries on `0.0.2` are untouched.

---

## 2. Project configuration

| Where                     | Setting                                                                              | Why                                                                |
| ------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `app.config.js`           | `runtimeVersion.policy: 'appVersion'`                                                | Each `package.json#version` is its own runtime.                    |
| `app.config.js`           | `updates.checkAutomatically: 'ON_ERROR_RECOVERY'`                                    | We control checks via `useOTAUpdate`, no SDK auto-prompt on boot.  |
| `app.config.js`           | `updates.fallbackToCacheTimeout: 0`                                                  | Splash screen never blocks waiting for an update.                  |
| `eas.json`                | 3 build profiles `development` / `preview` / `production` (each bakes same channel) | Channel ↔ branch is 1:1 by default.                                |
| `src/hooks/useOTAUpdate`  | Cold-start + resume check, throttled, `isCritical` aware                             | Non-blocking UX, telemetry hooks.                                  |
| `src/components/UpdatePrompt` | "Restart now / Later" modal                                                       | Lets the user choose when to apply non-critical updates.           |
| `src/components/RuntimeBadge` | Bottom-right overlay (DEV / preview only)                                          | QA verifies the actual runtime + updateId on-device.               |

---

## 3. Workflow A — ship a normal update (current runtime)

Use this when you fixed a JS bug or added a JS-only feature on the **current** app version.

```
┌────────────────────────────────────────────────────────────────────┐
│  feat branch  →  MR review  →  merge to main                       │
│       │                                                            │
│       ▼                                                            │
│  yarn eas:update:status         # sanity check                     │
│  yarn eas:update:preview        # publish to `preview` branch      │
│       │                                                            │
│       ▼                                                            │
│  QA installs preview build → opens app                             │
│  RuntimeBadge shows: runtime ✓, channel=preview, updateId=new ✓    │
│  QA runs core flows                                                │
│       │                                                            │
│       ▼                                                            │
│  yarn eas:update:promote        # republish preview → production   │
│       │                                                            │
│       ▼                                                            │
│  Monitor for 24h (Sentry, crash reports). Roll back if needed.     │
└────────────────────────────────────────────────────────────────────┘
```

> `update:promote` (= `eas update:republish`) **copies the same artifact** that QA validated. The JS is never re-bundled, so the production update is byte-identical to the one QA tested.

---

## 4. Workflow B — hotfix an OLDER runtime

Use this when production is on `0.0.2` (stable) but binaries on the older runtime `0.0.1` still need a fix.

### The problem you must understand first

If you simply create a hotfix branch from the old code, then merge it into main, **Git's three-way merge will overwrite `package.json#version` back to `0.0.2`** (because main moved forward and your hotfix branch did not touch the version). Publishing from the merge commit then sends the update to runtime `0.0.2`, not `0.0.1`. Binaries on `0.0.1` get nothing.

### Safe step-by-step

```bash
# Step 1 — start the hotfix branch from the binary's actual code
git fetch origin
git switch -c hotfix/<runtime>-<short-desc> <commit-or-tag-of-old-binary>

# Step 2 — apply the fix (only JS / TS / asset changes!)
# Verify: no diff in `ios/`, `android/`, `app.config.js` plugins, native deps in yarn.lock
git diff <old-binary-commit>..HEAD -- ios android app.config.js yarn.lock
# Output should be empty.

# Step 3 — keep package.json#version pinned to the OLD runtime
node -p "require('./package.json').version"   # must equal the target runtime

git commit -am "fix(<area>): hotfix for runtime <runtime>"
git push -u origin hotfix/<runtime>-<short-desc>

# Step 4 — open MR, get review, merge to main
# (Optional cleanup: see "Avoiding the version overwrite" below.)

# Step 5 — checkout the merge commit
git fetch origin
git checkout <merge-commit-sha>

# Step 6 — temporarily override package.json#version to the OLD runtime
node -e "let p=require('./package.json'); p.version='<runtime>'; require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2)+'\n')"
node -p "require('./package.json').version"   # confirm

# Step 7 — publish (use --allow-dirty because we modified package.json locally)
yarn eas:update:status
yarn eas:update:preview --allow-dirty --environment preview

# Step 8 — restore package.json
git checkout package.json

# Step 9 — QA on a binary with the OLD runtime, then promote
yarn eas:update:promote
```

### Avoiding the version overwrite (recommended for repeat hotfixes)

Add a merge driver so `package.json` never auto-overrides on hotfix merges:

```bash
git config merge.preserve-package-version.driver true
echo 'package.json merge=preserve-package-version' >> .gitattributes
```

Then the hotfix branch keeps its `version=0.0.1` through the merge automatically — Step 6 / Step 8 are no longer required.

---

## 5. Workflow C — critical update (force immediate reload)

For showstopper bugs you cannot wait for the user to tap "Restart".

```bash
yarn eas:update:preview --extra-metadata '{"isCritical":true,"releaseNotes":"Fix crash on checkout"}'
# Verify on a preview device, then:
yarn eas:update:promote
```

`useOTAUpdate` reads `manifest.extra.isCritical` and calls `Updates.reloadAsync()` instead of showing the prompt.

---

## 6. Workflow D — rollback

```bash
yarn eas:update:status            # find the bad updateId
yarn eas:update:rollback          # revert the channel to the previous update
```

Rollback is instant for new sessions. Already-running sessions keep the bad bundle until next restart.

---

## 7. When OTA is NOT possible

You **must build a new binary** (and bump `package.json#version`) when the change touches:

- Native code in `ios/` or `android/`
- A dependency that ships native code (autolinked `react-native-*`, most `expo-*`)
- `app.config.js` plugin config (e.g. `expo-build-properties`)
- `runtimeVersion`, `scheme`, iOS bundle id, Android package name
- Expo SDK version

Quick audit before publishing:

```bash
git diff <last-binary-tag>..HEAD -- ios android app.config.js yarn.lock
```

Output empty → OTA is safe. Anything listed → build a new binary first.

---

## 8. Verify on device

| Signal                           | Where                            | Looks like                                    |
| -------------------------------- | -------------------------------- | --------------------------------------------- |
| `RuntimeBadge` (DEV / preview)   | Bottom-right of the screen       | `rt 0.0.1 · preview · 019da8d9…`              |
| Boot log                         | Metro / device console           | `[OTA] runtime info { runtimeVersion: ... }`  |
| Detailed inspect                 | Tap the badge                    | shows `isEmbeddedLaunch`, `createdAt`, etc.   |
| Dashboard cross-check            | <https://expo.dev/.../updates>   | `updateId` matches what the badge shows       |

---

## 9. Pre-flight checklists

### Before `yarn eas:update:preview`

- [ ] Code merged through an approved MR
- [ ] `git status` clean (the script blocks otherwise; `--allow-dirty` only for hotfix Step 7)
- [ ] HEAD pushed to remote (script warns otherwise)
- [ ] `yarn lint:check && yarn test` pass
- [ ] No native-affecting diff (see §7)
- [ ] `yarn eas:update:status` reviewed

### Before `yarn eas:update:promote`

- [ ] QA installed the preview build and `RuntimeBadge` confirmed:
  - `runtimeVersion` matches the target binary
  - `updateId` matches the update just published
  - Login, checkout, push notifications, and other core flows pass
- [ ] Preview update has been live ≥ 24h with no new crash reports
- [ ] Someone is on standby to monitor and run rollback if needed

---

## 10. Trace update ↔ git commit

Every update on the dashboard carries a `gitCommitHash`. The publish script also sets `--message "<short-sha> <commit subject>"`, so the dashboard maps cleanly back to code.

```bash
eas update:view <updateId>            # full metadata for one update
git log --oneline | grep <short-sha>  # find the commit locally
```

---

## 11. Common pitfalls

| Pitfall                                                                                    | Fix                                                                                              |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Publish to `production` directly                                                            | Use the `preview → promote` flow. The script already prompts a confirmation when you try.        |
| Hotfix merge silently bumped `package.json#version` to current main version                 | Use the override-and-restore steps in §4, or install the merge driver.                           |
| `Nonexistent flag: --runtime-version`                                                       | There is no such flag. Runtime is derived from `package.json#version` at publish time.           |
| `eas.json is not valid. "update" is not allowed`                                            | `eas.json` only allows `cli`, `build`, `submit` at the top level. Channels go inside `build.*`.  |
| `--non-interactive` rejected without `--environment`                                        | Pass `--environment preview` (or `production`) when running headless / in CI.                    |
| Update published but device never picks it up                                               | Check binary's runtime equals the update's runtime, and the binary's channel points to that branch. |
| Update visible on dashboard but `RuntimeBadge` shows old `updateId`                         | App may need a restart; `useOTAUpdate` only fetches in non-DEV builds. Re-open the preview build. |

---

## 12. Dashboard snapshot

| Channel       | Branch        | Latest runtime | Note                                          |
| ------------- | ------------- | -------------- | --------------------------------------------- |
| `production`  | `production`  | 0.0.2          | also has legacy 1.0.0 + 0.0.1 entries          |
| `preview`     | `preview`     | 0.0.2          | same                                           |
| `development` | `development` | (empty)        | OK                                             |

> Legacy `1.0.0` entries are harmless (no binary in the wild has that runtime, so the server never serves them). Delete from the web dashboard if you want a clean history.

---

## 13. Quick command reference

| Need                                | Command                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| See channels / branches / updates   | `yarn eas:update:status`                                                                         |
| Publish current commit to preview   | `yarn eas:update:preview`                                                                        |
| Promote preview → production        | `yarn eas:update:promote`                                                                        |
| Rollback production                  | `yarn eas:update:rollback`                                                                       |
| Critical update                      | `yarn eas:update:preview --extra-metadata '{"isCritical":true}'`                                 |
| Publish to a specific runtime       | Override `package.json#version`, then `yarn eas:update:preview --allow-dirty`                     |
| Inspect one update                   | `eas update:view <updateId>`                                                                     |
| Move a channel to a different branch | `eas channel:edit <channel> --branch <branch>`                                                   |
| Audit native-affecting diffs         | `git diff <last-binary-tag>..HEAD -- ios android app.config.js yarn.lock`                        |
