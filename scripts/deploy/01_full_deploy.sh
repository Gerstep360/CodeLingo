#!/usr/bin/env bash
set -eo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$ROOT/scripts/common.sh"
detect_node_environment || { echo "Instala Node con la opcion 7."; exit 1; }
cd "$ROOT"
"$NPM_BIN" ci
"$NPM_BIN" run validate:content
"$NPM_BIN" test
VITE_BASE_PATH=/CodeLingo/ "$NPM_BIN" run build
# Fail before replacing the existing frontend if the API is not ready.
bash "$ROOT/scripts/deploy/11_deploy_api.sh"
sudo mkdir -p "$TARGET_DIR"
if [[ "$(realpath "$ROOT/dist")" != "$(realpath -m "$TARGET_DIR/dist")" ]]; then
    # Preserve hashed assets still referenced by open tabs; replace the entry last.
    sudo mkdir -p "$TARGET_DIR/dist"
    sudo rsync -a --exclude=index.html "$ROOT/dist/" "$TARGET_DIR/dist/"
    sudo install -m 644 "$ROOT/dist/index.html" "$TARGET_DIR/dist/index.html"
fi
sudo find "$TARGET_DIR/dist" -type d -exec chmod 755 {} +
sudo find "$TARGET_DIR/dist" -type f -exec chmod 644 {} +
bash "$ROOT/scripts/deploy/03_nginx_config.sh"
echo "Actualizado: https://$SERVER_IP/CodeLingo/"
