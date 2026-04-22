#!/usr/bin/env bash
#
# Print the current EAS Update state: channels + branches + 5 most recent
# updates per branch. Run before and after each publish to verify.
#
# Usage: scripts/eas-update-status.sh

set -euo pipefail

echo "════════════════════════════════════════"
echo "  CHANNELS"
echo "════════════════════════════════════════"
eas channel:list 2>/dev/null | tail -n +5 || true

echo ""
echo "════════════════════════════════════════"
echo "  BRANCHES"
echo "════════════════════════════════════════"
eas branch:list 2>/dev/null | tail -n +5 || true

for branch in preview production; do
  echo ""
  echo "════════════════════════════════════════"
  echo "  RECENT UPDATES — branch: $branch"
  echo "════════════════════════════════════════"
  eas update:list --branch "$branch" --limit 5 2>/dev/null | tail -n +5 || true
done

echo ""
echo "════════════════════════════════════════"
echo "  LOCAL CONTEXT"
echo "════════════════════════════════════════"
echo "package.json#version : $(node -p "require('./package.json').version")"
echo "git branch           : $(git rev-parse --abbrev-ref HEAD)"
echo "git HEAD             : $(git rev-parse --short HEAD)"
echo "working tree         : $([[ -z "$(git status --porcelain)" ]] && echo 'clean' || echo 'DIRTY')"
