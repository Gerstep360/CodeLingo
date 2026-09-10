#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 09: VISUALIZADOR DE REGISTROS (LOGS) DE NGINX EN VIVO
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

main() {
    echo -e "\n${W}=== [Modulo 09: Ultimos registros de Nginx] ===${NC}\n"
    if [ -f "/var/log/nginx/error.log" ]; then
        echo -e "${R}[-- Ultimos 15 Errores en Nginx --]${NC}"
        tail -n 15 /var/log/nginx/error.log
    else
        echo -e "${GRAY}[-- No se encontro /var/log/nginx/error.log --]${NC}"
    fi

    echo ""
    if [ -f "/var/log/nginx/access.log" ]; then
        echo -e "${B}[-- Ultimos 15 Accesos a Nginx --]${NC}"
        tail -n 15 /var/log/nginx/access.log
    else
        echo -e "${GRAY}[-- No se encontro /var/log/nginx/access.log --]${NC}"
    fi

    echo ""
    read -r -p "Presione Enter para volver al menu principal..." dummy
}

main "$@"
