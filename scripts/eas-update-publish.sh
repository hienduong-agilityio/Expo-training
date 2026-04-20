#!/usr/bin/env bash
#
# Publish 1 EAS Update lên đúng branch, có guard rail cho first-time setup.
#
# Usage:
#   scripts/eas-update-publish.sh <branch> [--allow-dirty] [extra eas-update args...]
#
# Ví dụ:
#   scripts/eas-update-publish.sh preview
#   scripts/eas-update-publish.sh production --extra-metadata '{"isCritical":true}'
#
# Guards:
#   1. Working tree phải clean (trừ khi --allow-dirty) → update reproducible.
#   2. HEAD đã được push lên remote (warn nếu local-only) → trace được commit.
#   3. Hỏi xác nhận trước khi publish vào branch `production`.
#   4. Tự suy ra runtime version từ package.json để in cho user verify.

set -euo pipefail

BRANCH="${1:-}"
if [[ -z "$BRANCH" ]]; then
  echo "Usage: $0 <branch> [--allow-dirty] [extra eas-update args...]" >&2
  exit 1
fi
shift

ALLOW_DIRTY=false
EXTRA_ARGS=()
for arg in "$@"; do
  if [[ "$arg" == "--allow-dirty" ]]; then
    ALLOW_DIRTY=true
  else
    EXTRA_ARGS+=("$arg")
  fi
done

# 1. Working tree clean?
if [[ -n "$(git status --porcelain)" ]] && [[ "$ALLOW_DIRTY" != true ]]; then
  echo "✘ Working tree có thay đổi chưa commit:" >&2
  git status --short >&2
  echo "" >&2
  echo "  → Commit trước khi publish (best practice: update phải gắn với 1 commit)." >&2
  echo "  → Hoặc chạy lại với --allow-dirty nếu thực sự muốn." >&2
  exit 1
fi

# 2. HEAD pushed?
HEAD_SHA="$(git rev-parse HEAD)"
if ! git branch -r --contains "$HEAD_SHA" | grep -q .; then
  echo "⚠  HEAD ($HEAD_SHA) chưa được push lên remote. Update sẽ trace tới commit local-only."
fi

# 3. Confirm khi publish production
if [[ "$BRANCH" == "production" ]]; then
  read -rp "→ Bạn đang publish trực tiếp vào branch 'production'. Thường nên dùng eas:update:promote (preview → production). Continue? (y/N) " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Huỷ."
    exit 1
  fi
fi

# 4. In runtime cho user verify
PKG_VERSION="$(node -p "require('./package.json').version")"
COMMIT_SUBJECT="$(git log -1 --pretty=%s)"
COMMIT_SHA_SHORT="$(git rev-parse --short HEAD)"

cat <<EOF

→ Publishing EAS Update
    branch          : $BRANCH
    runtimeVersion  : $PKG_VERSION (lấy từ package.json, policy=appVersion)
    commit          : $COMMIT_SHA_SHORT  $COMMIT_SUBJECT
    extra args      : ${EXTRA_ARGS[*]:-(none)}

EOF

eas update \
  --branch "$BRANCH" \
  --message "$COMMIT_SHA_SHORT $COMMIT_SUBJECT" \
  --non-interactive \
  "${EXTRA_ARGS[@]}"

cat <<EOF

✓ Đã publish lên branch '$BRANCH'.
  Verify:  yarn eas:update:status
  Promote: yarn eas:update:promote   (chỉ khi đang ở preview branch)
  Rollback: yarn eas:update:rollback  (nếu có vấn đề)
EOF
