#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 01: DESPLIEGUE COMPLETO (BUILD + NGINX)
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

main() {
    echo -e "\n${B}=== [Modulo 01: Despliegue Completo de CodeLingo en Produccion] ===${NC}"
    echo -e "  Destino Web: ${W}$TARGET_DIR${NC}"
    echo -e "  Subruta URL: ${B}http://$SERVER_IP/CodeLingo/${NC}\n"

    # 1. Verificar entorno Node.js
    echo -e "${Y}--- [1/5] Verificando Node.js y npm ---${NC}"
    if ! detect_node_environment; then
        echo -e "${O}[!] Node.js no detectado. Intentando auto-instalacion express...${NC}"
        bash "$(dirname "${BASH_SOURCE[0]}")/07_install_node.sh" || {
            echo -e "${R}[FALLO] No se pudo preparar Node.js. Abortando despliegue.${NC}"
            return 1
        }
    fi
    echo -e "${G}[OK] Entorno activo: Node $NODE_VER | npm $NPM_VER${NC}"

    # 2. Instalar dependencias
    echo -e "\n${Y}--- [2/5] Instalando dependencias de React ---${NC}"
    cd "$SCRIPT_DIR"
    "$NPM_BIN" install --legacy-peer-deps > /tmp/codelingo_npm.log 2>&1 &
    local npm_pid=$!
    if ! run_ascii_spinner "$npm_pid" "Instalando paquetes npm" 120; then
        echo -e "${R}[FALLO] Error en npm install. Detalle del registro:${NC}"
        tail -n 25 /tmp/codelingo_npm.log
        return 1
    fi

    # 3. Compilacion Vite
    echo -e "\n${Y}--- [3/5] Compilando frontend React para /CodeLingo/ ---${NC}"
    export VITE_BASE_PATH="/CodeLingo/"
    "$NPM_BIN" run build > /tmp/codelingo_vite.log 2>&1 &
    local build_pid=$!
    if ! run_ascii_spinner "$build_pid" "Compilando con Vite" 90; then
        echo -e "${R}[FALLO] Error durante el build. Detalle:${NC}"
        tail -n 25 /tmp/codelingo_vite.log
        return 1
    fi

    if [ ! -d "$SCRIPT_DIR/dist" ]; then
        echo -e "${R}[FALLO] No se genero el directorio dist/. Abortando.${NC}"
        return 1
    fi

    # 4. Despliegue en /var/www/CodeLingo
    echo -e "\n${Y}--- [4/5] Desplegando en directorio web destino ---${NC}"
    sudo mkdir -p "$TARGET_DIR"
    sudo rm -rf "${TARGET_DIR:?}/dist"
    sudo cp -r "$SCRIPT_DIR/dist" "$TARGET_DIR/"

    # Generar pagina de mantenimiento estatica por si se apaga el servidor
    sudo tee "$TARGET_DIR/dist/maintenance.html" > /dev/null << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeLingo - En Mantenimiento</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; border: 2px solid #334155; border-radius: 16px; padding: 40px; text-align: center; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; background: rgba(245,158,11,0.15); color: #f59e0b; font-weight: bold; font-size: 14px; margin-bottom: 16px; border: 1px solid #f59e0b; }
        h1 { margin: 0 0 12px; font-size: 26px; }
        p { color: #94a3b8; line-height: 1.6; margin: 0; font-size: 15px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">[ MANTENIMIENTO TEMPORAL ]</div>
        <h1>CodeLingo Vargas Sprint</h1>
        <p>El simulador de exámenes se encuentra actualmente en pausa por mantenimiento o actualización. Estará disponible en breve.</p>
    </div>
</body>
</html>
EOF

    if id "www-data" >/dev/null 2>&1; then
        sudo chown -R www-data:www-data "$TARGET_DIR"
    fi
    sudo chmod -R 755 "$TARGET_DIR"
    draw_ascii_progress "Sincronizando archivos y permisos"

    # 5. Activar configuracion en Nginx
    echo -e "\n${Y}--- [5/5] Asegurando configuracion en Nginx ---${NC}"
    bash "$(dirname "${BASH_SOURCE[0]}")/03_nginx_config.sh" || true

    echo -e "\n${G}+--------------------------------------------------------------------------+${NC}"
    echo -e "${G}|  [OK] DESPLIEGUE FINALIZADO CON EXITO                                    |${NC}"
    echo -e "${G}+--------------------------------------------------------------------------+${NC}"
    echo -e "  URL Activa:    ${B}http://$SERVER_IP/CodeLingo/${NC}"
    echo -e "  Angular taji:  ${G}Operando sin alteraciones en la raiz (/)${NC}\n"
}

main "$@"
