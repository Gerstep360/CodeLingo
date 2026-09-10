#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 06: DIAGNOSTICO INTEGRAL DEL SISTEMA Y SERVICIOS
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

echo -e "\n${Y}+--------------------------------------------------------------------------+${NC}"
echo -e "${Y}|${W}  [?] INFORME DE DIAGNOSTICO INTEGRAL DEL SISTEMA                          ${Y}|${NC}"
echo -e "${Y}+--------------------------------------------------------------------------+${NC}"

echo -n "  • Servicio Nginx:  "
if systemctl is-active --quiet nginx 2>/dev/null; then
    echo -e "${G}[OK] Activo y en ejecucion${NC}"
else
    echo -e "${R}[!] Detenido o no instalado${NC}"
fi

echo -n "  • Sintaxis Nginx:  "
if sudo nginx -t >/dev/null 2>&1; then
    echo -e "${G}[OK] Configuraciones validas${NC}"
else
    echo -e "${R}[!] Error en archivos de configuracion${NC}"
fi

echo -n "  • Motor Node.js:   "
if detect_node_environment; then
    echo -e "${G}[OK] $NODE_VER ($NODE_BIN)${NC}"
else
    echo -e "${R}[!] No detectado (Ejecute opcion 7)${NC}"
fi

echo -n "  • Gestor npm:      "
if [ "$NPM_VER" != "No detectado" ]; then
    echo -e "${G}[OK] $NPM_VER${NC}"
else
    echo -e "${R}[!] No detectado${NC}"
fi

echo -n "  • Build Web:       "
if [ -f "$TARGET_DIR/dist/index.html" ]; then
    local b_size
    b_size=$(du -sh "$TARGET_DIR/dist" 2>/dev/null | cut -f1 || echo "OK")
    echo -e "${G}[OK] Presente en $TARGET_DIR ($b_size)${NC}"
else
    echo -e "${R}[!] No existe build en $TARGET_DIR (Ejecute opcion 1)${NC}"
fi

echo -n "  • Snippet Nginx:   "
if [ -f "$SNIPPET_DEST" ]; then
    echo -e "${G}[OK] Instalado en $SNIPPET_DEST${NC}"
else
    echo -e "${Y}[--] No encontrado en $SNIPPET_DEST${NC}"
fi

echo -n "  • Proyecto taji:   "
if [ -d "/root/app/taji" ] || [ -d "$HOME/app/taji" ]; then
    echo -e "${G}[OK] Directorio Angular intacto${NC}"
else
    echo -e "${GRAY}[--] No detectado en ~/app/taji${NC}"
fi

echo -n "  • Test HTTP Local: "
if command -v curl >/dev/null 2>&1; then
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/CodeLingo/ || true)
    if [ "$code" == "200" ]; then
        echo -e "${G}[OK] HTTP 200 (Respuesta exitosa de produccion)${NC}"
    elif [ "$code" == "503" ]; then
        echo -e "${Y}[OK] HTTP 503 (Servidor en Modo Mantenimiento)${NC}"
    else
        echo -e "${Y}Codigo HTTP: $code (Verifique si Nginx esta activo)${NC}"
    fi
else
    echo -e "${GRAY}[--] curl no disponible${NC}"
fi
echo -e "${Y}+--------------------------------------------------------------------------+${NC}\n"
