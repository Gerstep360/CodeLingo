#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 02: ACTUALIZACION DESDE GIT (PULL + BUILD + RELOAD)
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

echo -e "\n${CY}=== [Modulo 02: Actualizacion Rapida desde Git] ===${NC}"
cd "$SCRIPT_DIR"

echo -e "${Y}--- [1/3] Descargando ultimos cambios de GitHub ---${NC}"
git pull origin main > /tmp/codelingo_git.log 2>&1 &
local git_pid=$!
if ! run_ascii_spinner $git_pid "Obteniendo commits" 45; then
    cat /tmp/codelingo_git.log
    exit 1
fi

echo -e "\n${Y}--- [2/3] Recompilando aplicacion ---${NC}"
detect_node_environment || true
export VITE_BASE_PATH="/CodeLingo/"
"$NPM_BIN" run build > /tmp/codelingo_vite.log 2>&1 &
local build_pid=$!
if ! run_ascii_spinner $build_pid "Compilando nueva version" 90; then
    cat /tmp/codelingo_vite.log
    exit 1
fi

echo -e "\n${Y}--- [3/3] Sincronizando directorio web y recargando Nginx ---${NC}"
sudo cp -r "$SCRIPT_DIR/dist" "$TARGET_DIR/"
if id "www-data" >/dev/null 2>&1; then
    sudo chown -R www-data:www-data "$TARGET_DIR"
fi
sudo chmod -R 755 "$TARGET_DIR"

if command -v nginx >/dev/null 2>&1; then
    sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
fi
draw_ascii_progress "Aplicando cambios en produccion"

echo -e "\n${G}[OK] Version actualizada con exito.${NC}"
echo -e "  Verifique en: ${B}http://$SERVER_IP/CodeLingo/${NC}\n"
