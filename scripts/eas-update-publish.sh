#!/usr/bin/env bash
#
# Publish a single EAS Update to the given branch with first-time-setup guard rails.
#
# Usage:
#   scripts/eas-update-publish.sh <branch> [--allow-dirty] [--environment <env>] [extra eas-update args...]
#
# Examples:
#   scripts/eas-update-publish.sh preview
#   scripts/eas-update-publish.sh production --extra-metadata '{"isCritical":true}'
#   scripts/eas-update-publish.sh hotfix-0.0.1 --allow-dirty --environment preview
#
# Guards:
#   1. Working tree must be clean (unless --allow-dirty) so the update is reproducible.
#   2. HEAD must be pushed to a remote (warn when local-only) so the commit is traceable.
#   3. Ask for explicit confirmation when publishing directly to `production`.
#   4. Print the runtime version derived from package.json so the user can verify.
#   5. Auto-pass `--environment` derived from the branch (required by `--non-interactive`),
#      unless the caller already provided one in the extra args.

set -euo pipefail

BRANCH="${1:-}"
if [[ -z "$BRANCH" ]]; then
  echo "Usage: $0 <branch> [--allow-dirty] [--environment <env>] [extra eas-update args...]" >&2
  exit 1
fi
shift

ALLOW_DIRTY=false
ENV_OVERRIDDEN=false
EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --allow-dirty)
      ALLOW_DIRTY=true
      shift
      ;;
    --environment)
      ENV_OVERRIDDEN=true
      EXTRA_ARGS+=("$1")
      shift
      if [[ $# -gt 0 ]]; then
        EXTRA_ARGS+=("$1")
        shift
      fi
      ;;
    --environment=*)
      ENV_OVERRIDDEN=true
      EXTRA_ARGS+=("$1")
      shift
      ;;
    *)
      EXTRA_ARGS+=("$1")
      shift
      ;;
  esac
done

# Map branch → EAS environment. Custom branches default to `preview` (safe sandbox).
if [[ "$ENV_OVERRIDDEN" != true ]]; then
  case "$BRANCH" in
    development|preview|production)
      ENVIRONMENT="$BRANCH"
      ;;
    *)
      ENVIRONMENT="preview"
      echo "ℹ  Branch '$BRANCH' is not a default environment; using --environment preview."
      ;;
  esac
  EXTRA_ARGS+=(--environment "$ENVIRONMENT")
fi

if [[ -n "$(git status --porcelain)" ]] && [[ "$ALLOW_DIRTY" != true ]]; then
  echo "✘ Working tree has uncommitted changes:" >&2
  git status --short >&2
  echo "" >&2
  echo "  → Commit first so every update maps to a single commit (best practice)." >&2
  echo "  → Or rerun with --allow-dirty if you really need to." >&2
  exit 1
fi

HEAD_SHA="$(git rev-parse HEAD)"
if ! git branch -r --contains "$HEAD_SHA" | grep -q .; then
  echo "⚠  HEAD ($HEAD_SHA) has not been pushed to any remote; the update will point to a local-only commit."
fi

if [[ "$BRANCH" == "production" ]]; then
  read -rp "→ Publishing directly to 'production'. Prefer 'yarn eas:update:promote' (preview → production). Continue? (y/N) " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Aborted."
    exit 1
  fi
fi

PKG_VERSION="$(node -p "require('./package.json').version")"
COMMIT_SUBJECT="$(git log -1 --pretty=%s)"
COMMIT_SHA_SHORT="$(git rev-parse --short HEAD)"

cat <<EOF

→ Publishing EAS Update
    branch          : $BRANCH
    runtimeVersion  : $PKG_VERSION (from package.json, policy=appVersion)
    commit          : $COMMIT_SHA_SHORT  $COMMIT_SUBJECT
    extra args      : ${EXTRA_ARGS[*]:-(none)}

EOF

eas update \
  --branch "$BRANCH" \
  --message "$COMMIT_SHA_SHORT $COMMIT_SUBJECT" \
  --non-interactive \
  ${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"}

cat <<EOF

✓ Published to branch '$BRANCH'.
  Verify:   yarn eas:update:status
  Promote:  yarn eas:update:promote   (only after QA signs off on preview)
  Rollback: yarn eas:update:rollback  (if something goes wrong)
EOF
