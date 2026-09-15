#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# npm ci rebuilds dependencies from the lockfile. Keep server data and secrets.
exec bash "$ROOT/scripts/deploy/01_full_deploy.sh"
