#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 05: ENCENDER SERVIDOR / ACTIVAR MODO PRODUCCION
# ==============================================================================
# Restaura el enrutamiento normal de CodeLingo en /CodeLingo/ y recarga Nginx.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

main() {
    echo -e "\n${G}=== [Modulo 05: Encendiendo Servidor / Reactivando Web CodeLingo] ===${NC}"

    sudo tee "$SNIPPET_DEST" > /dev/null << 'EOF'
# ==============================================================================
# CodeLingo - ESTADO: ACTIVO / PRODUCCION
# ==============================================================================

# 1. Normalización de URL
location = /CodeLingo {
    return 301 /CodeLingo/;
}

location ~* ^/codelingo/?$ {
    return 301 /CodeLingo/;
}

# 2. Enrutamiento principal SPA
location ^~ /CodeLingo/ {
    alias /var/www/CodeLingo/dist/;
    index index.html;
    try_files $uri $uri/ /CodeLingo/index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}

# 3. Assets estáticos con cache inmutable
location ^~ /CodeLingo/assets/ {
    alias /var/www/CodeLingo/dist/assets/;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}
EOF

    if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
        draw_ascii_progress "Reactivando rutas en Nginx"
        echo -e "\n${G}[OK] CodeLingo esta nuevamente ACTIVO y ONLINE.${NC}"
        echo -e "  Accede en: ${B}http://$SERVER_IP/CodeLingo/${NC}\n"
        return 0
    else
        echo -e "\n${R}[FALLO] Error al recargar Nginx:${NC}"
        cat /tmp/nginx_test.log
        return 1
    fi
}

main "$@"
