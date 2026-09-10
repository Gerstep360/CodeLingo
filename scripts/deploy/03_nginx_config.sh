#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 03: CONFIGURACION Y ENLACE SEGURO EN NGINX
# ==============================================================================
# Instala el snippet en /etc/nginx/snippets/codelingo.conf e inyecta la directiva
# en la configuración activa sin tocar la aplicación Angular en '/'.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

SILENT_MODE=false
[ "$1" == "--silent" ] && SILENT_MODE=true

if [ "$SILENT_MODE" = false ]; then
    echo -e "\n${B}=== [Modulo 03: Configuracion Nginx para /CodeLingo] ===${NC}"
fi

sudo mkdir -p /etc/nginx/snippets
sudo cp "$SCRIPT_DIR/nginx-codelingo.conf" "$SNIPPET_DEST"

# Localizar archivo de configuración de Nginx activo (default o primer .conf)
SITE_CONF=""
if [ -f "/etc/nginx/sites-available/default" ]; then
    SITE_CONF="/etc/nginx/sites-available/default"
elif [ -f "/etc/nginx/conf.d/default.conf" ]; then
    SITE_CONF="/etc/nginx/conf.d/default.conf"
else
    # Buscar el primer sitio activo en sites-enabled
    for f in /etc/nginx/sites-enabled/*; do
        if [ -f "$f" ]; then
            SITE_CONF="$f"
            break
        fi
    done
fi

if [ -n "$SITE_CONF" ] && [ -f "$SITE_CONF" ]; then
    if ! grep -q "codelingo.conf" "$SITE_CONF"; then
        sudo awk '
            /^[[:space:]]*server[[:space:]]*\{/ { in_server=1 }
            in_server && /^[[:space:]]*\}/ && !inserted {
                print "    # Subruta de aprendizaje CodeLingo (coexistencia segura con Angular)"
                print "    include /etc/nginx/snippets/codelingo.conf;"
                inserted=1
            }
            { print }
        ' "$SITE_CONF" > /tmp/nginx_site.tmp && sudo mv /tmp/nginx_site.tmp "$SITE_CONF"
    fi
fi

# Validar y recargar Nginx
if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
    sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
    if [ "$SILENT_MODE" = false ]; then
        echo -e "${G}[OK] Nginx configurado y recargado con exito.${NC}"
        echo -e "  Snippet: ${W}$SNIPPET_DEST${NC}"
        echo -e "  Subruta: ${B}http://$SERVER_IP/CodeLingo/${NC}"
    fi
    exit 0
else
    echo -e "${R}[FALLO] Error de sintaxis en Nginx:${NC}"
    cat /tmp/nginx_test.log
    exit 1
fi
