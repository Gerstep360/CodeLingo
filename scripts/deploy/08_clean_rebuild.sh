#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 08: LIMPIEZA DE CACHE Y RESET TOTAL
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

echo -e "\n${R}=== [Modulo 08: Limpiando node_modules, dist y cache de build] ===${NC}"
cd "$SCRIPT_DIR"
rm -rf node_modules dist package-lock.json
draw_ascii_progress "Eliminando archivos temporales"
echo -e "${G}[OK] Cache limpia. Procediendo a reinstalacion y despliegue limpio...${NC}\n"

bash "$(dirname "${BASH_SOURCE[0]}")/01_full_deploy.sh"
