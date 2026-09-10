#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 04: APAGAR SERVIDOR / ACTIVAR MODO MANTENIMIENTO
# ==============================================================================
# Oculta temporalmente la aplicación CodeLingo mostrando un aviso de mantenimiento,
# respondiendo con código HTTP 503 sin detener Nginx ni afectar a la app Angular.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

echo -e "\n${R}=== [Modulo 04: Apagando Servidor / Ocultando Web CodeLingo] ===${NC}"

# Escribir configuración de Nginx en modo Mantenimiento
sudo tee "$SNIPPET_DEST" > /dev/null << 'EOF'
# ==============================================================================
# CodeLingo - ESTADO: APAGADO / MODO MANTENIMIENTO
# ==============================================================================
location ^~ /CodeLingo {
    alias /var/www/CodeLingo/dist/;
    index maintenance.html;
    try_files /maintenance.html =503;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Retry-After "3600" always;
}
EOF

if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
    sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
    draw_ascii_progress "Desactivando rutas en Nginx"
    echo -e "\n${Y}[OK] CodeLingo esta ahora APAGADO y FUERA DE LINEA.${NC}"
    echo -e "  Cualquier intento de acceso a /CodeLingo mostrara la pantalla de mantenimiento."
    echo -e "  ${G}Tu aplicacion Angular (taji) en la raiz sigue funcionando sin afectacion.${NC}\n"
    exit 0
else
    echo -e "\n${R}[FALLO] Error al recargar Nginx:${NC}"
    cat /tmp/nginx_test.log
    exit 1
fi
