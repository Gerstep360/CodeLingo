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
# Nginx sirve directo de $ROOT/dist — no hay copia a /var/www.
# Solo permisos para que www-data pueda leer los archivos estaticos.
sudo find "$ROOT/dist" -type d -exec chmod 755 {} +
sudo find "$ROOT/dist" -type f -exec chmod 644 {} +
echo "Frontend compilado en $ROOT/dist"

# API Laravel
bash "$ROOT/scripts/deploy/11_deploy_api.sh"

# Recargar Nginx con config actualizada
bash "$ROOT/scripts/deploy/03_nginx_config.sh"
echo "Actualizado: https://$SERVER_IP/CodeLingo/"
