#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 03: CONFIGURACION Y ENLACE SEGURO EN NGINX
# ==============================================================================
# Instala el snippet en /etc/nginx/snippets/codelingo.conf e inyecta la directiva
# en TODOS los vhosts activos de /etc/nginx/sites-enabled/ (donde corre taji)
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

main() {
    local silent_mode=false
    [ "$1" == "--silent" ] && silent_mode=true

    if [ "$silent_mode" = false ]; then
        echo -e "\n${B}=== [Modulo 03: Configuracion Inteligente Nginx para /CodeLingo] ===${NC}"
    fi

    # 1. Copiar snippet actualizado
    sudo mkdir -p /etc/nginx/snippets
    sudo cp "$SCRIPT_DIR/nginx-codelingo.conf" "$SNIPPET_DEST"

    # 2. Recolectar todas las configuraciones activas (sites-enabled y conf.d)
    local target_files=()

    # Buscar en sites-enabled (donde realmente corre taji/Angular)
    if [ -d "/etc/nginx/sites-enabled" ]; then
        for f in /etc/nginx/sites-enabled/*; do
            if [ -e "$f" ]; then
                local real_path
                real_path="$(readlink -f "$f" || echo "$f")"
                target_files+=("$real_path")
            fi
        done
    fi

    # Buscar en conf.d
    if [ -d "/etc/nginx/conf.d" ]; then
        for f in /etc/nginx/conf.d/*.conf; do
            if [ -f "$f" ]; then
                target_files+=("$f")
            fi
        done
    fi

    # Si sites-enabled está vacío, habilitar default de sites-available
    if [ ${#target_files[@]} -eq 0 ]; then
        if [ -f "/etc/nginx/sites-available/default" ]; then
            sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
            target_files+=("/etc/nginx/sites-available/default")
        fi
    fi

    local modified_count=0
    local already_count=0

    # 3. Inyectar snippet en cada bloque server { ... } activo
    for conf_file in "${target_files[@]}"; do
        [ ! -f "$conf_file" ] && continue

        # Solo modificar si tiene un bloque server { ... }
        if grep -qE "server[[:space:]]*\{" "$conf_file"; then
            if grep -q "codelingo.conf" "$conf_file"; then
                already_count=$(( already_count + 1 ))
            else
                # Crear respaldo de seguridad
                sudo cp "$conf_file" "${conf_file}.codelingo.bak"

                # Inyectar include justo dentro del bloque server {
                sudo awk '
                    /^[[:space:]]*server[[:space:]]*\{/ && !done {
                        print
                        print "    # Subruta de aprendizaje CodeLingo (coexistencia segura con Angular taji)"
                        print "    include /etc/nginx/snippets/codelingo.conf;"
                        done=1
                        next
                    }
                    { print }
                ' "$conf_file" > /tmp/nginx_patch.tmp && sudo mv /tmp/nginx_patch.tmp "$conf_file"

                # Validar sintaxis inmediatamente
                if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
                    sudo rm -f "${conf_file}.codelingo.bak"
                    modified_count=$(( modified_count + 1 ))
                    [ "$silent_mode" = false ] && echo -e "  ${G}[OK] Inyectado en:${NC} $conf_file"
                else
                    # Revertir si hubo error
                    sudo mv "${conf_file}.codelingo.bak" "$conf_file"
                    echo -e "  ${R}[ALERTA] Fallo sintaxis en $conf_file. Cambios revertidos.${NC}"
                fi
            fi
        fi
    done

    # 4. Validar y recargar Nginx
    if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
        if [ "$silent_mode" = false ]; then
            echo -e "\n${G}+--------------------------------------------------------------------------+${NC}"
            echo -e "${G}|  [OK] NGINX ENLAZADO Y RECARGADO CORRECTAMENTE                           |${NC}"
            echo -e "${G}+--------------------------------------------------------------------------+${NC}"
            echo -e "  Archivos vinculados: $modified_count nuevo(s), $already_count previo(s)"
            echo -e "  URL CodeLingo:       ${B}http://$SERVER_IP/CodeLingo/${NC}"
            echo -e "  Angular (taji):      ${G}Intacto en http://$SERVER_IP/${NC}\n"
        fi
        return 0
    else
        echo -e "\n${R}[FALLO] Error general al validar Nginx:${NC}"
        cat /tmp/nginx_test.log
        return 1
    fi
}

main "$@"
