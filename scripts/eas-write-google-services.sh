#!/usr/bin/env bash
# Create config/google-services.json from GOOGLE_SERVICES_BASE64 (EAS / eas build --local).
# Runs in eas-build-pre-install so the file exists even when it is gitignored (EAS archive may omit it).
# https://docs.expo.dev/build-reference/npm-hooks/
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

B64="${GOOGLE_SERVICES_BASE64:-}"
if [[ -z "$B64" ]]; then
  if [[ -f config/google-services.json ]]; then
    exit 0
  fi
  echo "eas-build-pre-install: Set GOOGLE_SERVICES_BASE64 or add config/google-services.json locally."
  exit 1
fi

mkdir -p config
CLEAN=$(printf '%s' "$B64" | tr -d '\n\r\t ')
PAD=$(( (4 - ${#CLEAN} % 4) % 4 ))
case $PAD in 1) CLEAN="${CLEAN}=" ;; 2) CLEAN="${CLEAN}==" ;; 3) CLEAN="${CLEAN}===" ;; esac
printf '%s' "$CLEAN" | base64 -d > config/google-services.json

if ! python3 -m json.tool config/google-services.json >/dev/null 2>&1; then
  echo "eas-build-pre-install: Decoded config/google-services.json is not valid JSON."
  exit 1
fi
