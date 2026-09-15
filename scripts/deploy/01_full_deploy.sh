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

# ── 1. Frontend: copiar a produccion PRIMERO (independiente del API) ──────────
# Hacerlo antes del deploy de Laravel evita que un fallo de PHP deje el
# frontend viejo en produccion. Los assets con hash son inmutables; el
# index.html se reemplaza al final para que las pestanas abiertas no rompan.
sudo mkdir -p "$TARGET_DIR/dist"
if [[ "$(realpath "$ROOT/dist")" != "$(realpath -m "$TARGET_DIR/dist")" ]]; then
    sudo rsync -a --exclude=index.html "$ROOT/dist/" "$TARGET_DIR/dist/"
    sudo install -m 644 "$ROOT/dist/index.html" "$TARGET_DIR/dist/index.html"
fi
sudo find "$TARGET_DIR/dist" -type d -exec chmod 755 {} +
sudo find "$TARGET_DIR/dist" -type f -exec chmod 644 {} +
echo "Frontend copiado a $TARGET_DIR/dist"

# ── 2. API Laravel: desplegar codigo y correr migraciones ────────────────────
bash "$ROOT/scripts/deploy/11_deploy_api.sh"

# ── 3. Nginx: recargar configuracion ─────────────────────────────────────────
bash "$ROOT/scripts/deploy/03_nginx_config.sh"
echo "Actualizado: https://$SERVER_IP/CodeLingo/"
