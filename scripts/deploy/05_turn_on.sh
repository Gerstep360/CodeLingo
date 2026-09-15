#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# Use the same complete snippet so reactivation preserves API routing.
exec bash "$ROOT/scripts/deploy/03_nginx_config.sh"
