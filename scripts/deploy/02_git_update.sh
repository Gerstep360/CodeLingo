#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
# Stop on local changes/conflicts; never discard server changes automatically.
git pull --ff-only origin main
exec bash "$ROOT/scripts/deploy/01_full_deploy.sh"
