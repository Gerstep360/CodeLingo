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

    # Si python3 está disponible, usar el script de reparación quirúrgica
    if command -v python3 >/dev/null 2>&1 && [ -f "$SCRIPT_DIR/scripts/fix_nginx.py" ]; then
        sudo python3 "$SCRIPT_DIR/scripts/fix_nginx.py"
        return $?
    fi

    # 1. Copiar snippet actualizado
    sudo mkdir -p /etc/nginx/snippets
    sudo cp "$SCRIPT_DIR/nginx-codelingo.conf" "$SNIPPET_DEST"

    # Asegurar que el directorio de destino y un index.html base existan siempre
    sudo mkdir -p "$TARGET_DIR/dist"
    if [ ! -f "$TARGET_DIR/dist/index.html" ]; then
        sudo tee "$TARGET_DIR/dist/index.html" > /dev/null << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>CodeLingo</title></head>
<body><h2>CodeLingo preparando entorno...</h2></body>
</html>
EOF
    fi
    if id "www-data" >/dev/null 2>&1; then
        sudo chown -R www-data:www-data "$TARGET_DIR" 2>/dev/null || true
    fi
    sudo chmod -R 755 "$TARGET_DIR"

    # 2. Recolectar todas las configuraciones activas (sites-enabled, conf.d y donde mencione taji)
    local raw_files=()

    # Buscar cualquier archivo en /etc/nginx/ que mencione "taji"
    if [ -d "/etc/nginx" ]; then
        while IFS= read -r f; do
            [ -n "$f" ] && [ -f "$f" ] && raw_files+=("$f")
        done < <(grep -rln "taji" /etc/nginx/ 2>/dev/null || true)
    fi

    # Buscar en sites-enabled
    if [ -d "/etc/nginx/sites-enabled" ]; then
        for f in /etc/nginx/sites-enabled/*; do
            [ -e "$f" ] && raw_files+=("$f")
        done
    fi

    # Buscar en conf.d
    if [ -d "/etc/nginx/conf.d" ]; then
        for f in /etc/nginx/conf.d/*.conf; do
            [ -f "$f" ] && raw_files+=("$f")
        done
    fi

    # Resolver enlaces simbolicos a rutas reales y eliminar duplicados
    local target_files=()
    for f in "${raw_files[@]}"; do
        local real_path
        real_path="$(readlink -f "$f" 2>/dev/null || echo "$f")"
        if [ -f "$real_path" ]; then
            local exists=false
            for tf in "${target_files[@]}"; do
                [ "$tf" == "$real_path" ] && exists=true && break
            done
            [ "$exists" = false ] && target_files+=("$real_path")
        fi
    done

    # Si no se halló ningún archivo, fallback a sites-available/default
    if [ ${#target_files[@]} -eq 0 ] && [ -f "/etc/nginx/sites-available/default" ]; then
        sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
        target_files+=("/etc/nginx/sites-available/default")
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

                # Inyectar include justo dentro de cada bloque server {
                sudo awk '
                    /^[[:space:]]*server[[:space:]]*\{/ {
                        print
                        print "    # Subruta de aprendizaje CodeLingo (coexistencia pacifica con Angular taji)"
                        print "    include /etc/nginx/snippets/codelingo.conf;"
                        next
                    }
                    { print }
                ' "$conf_file" > /tmp/nginx_patch.tmp && sudo mv /tmp/nginx_patch.tmp "$conf_file"

                # Validar sintaxis inmediatamente
                if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
                    sudo rm -f "${conf_file}.codelingo.bak"
                    modified_count=$(( modified_count + 1 ))
                    [ "$silent_mode" = false ] && echo -e "  ${G}[OK] Enlazado exitosamente en:${NC} $conf_file"
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
            echo -e "  Vhosts vinculados:   $modified_count nuevo(s), $already_count previo(s)"
            echo -e "  URL CodeLingo:       ${B}http://$SERVER_IP/CodeLingo/${NC}"
            echo -e "  Angular (taji):      ${G}Intacto en http://$SERVER_IP/taji/${NC}\n"
        fi
        return 0
    else
        echo -e "\n${R}[FALLO] Error general al validar Nginx:${NC}"
        cat /tmp/nginx_test.log
        return 1
    fi
}

main "$@"
