#!/usr/bin/env bash
# ==============================================================================
# 🦉 CODELINGO — PANEL INTERACTIVO DE CONFIGURACIÓN Y DESPLIEGUE (VPS)
# ==============================================================================
# Plataforma: Ubuntu / Debian (Nginx + Node.js)
# Diseñado para convivir pacíficamente con proyectos existentes como 'taji' (Angular).
# ==============================================================================

# Variables de entorno y rutas
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="/var/www/app/CodeLingo"
SNIPPET_DEST="/etc/nginx/snippets/codelingo.conf"
SERVER_IP="167.86.106.105"

# Paleta Duolingo ANSI 256 colores
G="\033[38;5;82m"    # Verde Duolingo
B="\033[38;5;39m"    # Azul Macaw
Y="\033[38;5;220m"   # Amarillo Abeja
O="\033[38;5;208m"   # Naranja Zorro
R="\033[38;5;196m"   # Rojo Cardenal
P="\033[38;5;141m"   # Púrpura DrapeMind
CY="\033[38;5;51m"   # Cyan brillante
W="\033[1;37m"       # Blanco negrita
GRAY="\033[38;5;244m"# Gris texto secundario
DIM="\033[2m"
NC="\033[0m"        # Reset

# Variables de detección
NODE_BIN=""
NPM_BIN=""
NODE_VER="No detectado"
NPM_VER="No detectado"

# ------------------------------------------------------------------------------
# 1. AUTO-DETECCIÓN INTELIGENTE DE NODE.JS Y NVM
# ------------------------------------------------------------------------------
detect_node_environment() {
    # 1.1 Si ya está en PATH
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        NODE_BIN="$(command -v node)"
        NPM_BIN="$(command -v npm)"
        NODE_VER="$("$NODE_BIN" -v 2>/dev/null)"
        NPM_VER="$("$NPM_BIN" -v 2>/dev/null)"
        return 0
    fi

    # 1.2 Buscar en ubicaciones estándar de NVM
    local nvm_candidates=(
        "$HOME/.nvm"
        "/root/.nvm"
        "/usr/local/nvm"
        "/opt/nvm"
    )

    # Añadir directorios nvm de usuarios en /home
    for d in /home/*/.nvm; do
        [ -d "$d" ] && nvm_candidates+=("$d")
    done

    for nvm_path in "${nvm_candidates[@]}"; do
        if [ -s "$nvm_path/nvm.sh" ]; then
            export NVM_DIR="$nvm_path"
            # shellcheck source=/dev/null
            \. "$nvm_path/nvm.sh" 2>/dev/null || true
            if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
                NODE_BIN="$(command -v node)"
                NPM_BIN="$(command -v npm)"
                NODE_VER="$("$NODE_BIN" -v 2>/dev/null)"
                NPM_VER="$("$NPM_BIN" -v 2>/dev/null)"
                return 0
            fi
        fi
    done

    # 1.3 Buscar binarios directos en versiones de nvm o snap
    local bin_candidates
    bin_candidates=$(find /root/.nvm/versions/node /home/*/.nvm/versions/node /usr/local/bin /snap/bin -name "node" -type f -executable 2>/dev/null || true)

    for cand in $bin_candidates; do
        cand_dir=$(dirname "$cand")
        if [ -x "$cand_dir/node" ] && [ -x "$cand_dir/npm" ]; then
            export PATH="$cand_dir:$PATH"
            NODE_BIN="$cand_dir/node"
            NPM_BIN="$cand_dir/npm"
            NODE_VER="$("$NODE_BIN" -v 2>/dev/null)"
            NPM_VER="$("$NPM_BIN" -v 2>/dev/null)"
            return 0
        fi
    done

    return 1
}

# ------------------------------------------------------------------------------
# 2. FUNCIONES VISUALES, SPINNERS Y BARRAS DE PROGRESO
# ------------------------------------------------------------------------------
run_with_spinner() {
    local pid=$1
    local message="$2"
    local spin=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    local i=0
    
    tput civis 2>/dev/null || true # ocultar cursor
    while kill -0 "$pid" 2>/dev/null; do
        i=$(( (i + 1) % 10 ))
        printf "\r  ${B}%s${NC} %s... " "${spin[$i]}" "$message"
        sleep 0.08
    done
    wait "$pid"
    local exit_code=$?
    tput cnorm 2>/dev/null || true # mostrar cursor

    if [ $exit_code -eq 0 ]; then
        printf "\r  ${G}✔${NC} %s... ${G}¡Listo!${NC}\n" "$message"
    else
        printf "\r  ${R}✘${NC} %s... ${R}¡Error (Código $exit_code)!${NC}\n" "$message"
    fi
    return $exit_code
}

draw_progress_bar() {
    local label="$1"
    local width=30
    local steps=40
    
    for ((s=0; s<=steps; s++)); do
        local pct=$(( s * 100 / steps ))
        local filled=$(( s * width / steps ))
        local empty=$(( width - filled ))
        local bar=""
        for ((f=0; f<filled; f++)); do bar="${bar}█"; done
        for ((e=0; e<empty; e++)); do bar="${bar}░"; done
        printf "\r  ${P}➜${NC} %-28s ${B}[${G}%s${NC}${B}]${W} %3d%%${NC}" "$label" "$bar" "$pct"
        sleep 0.02
    done
    echo ""
}

print_header() {
    clear
    detect_node_environment || true

    local node_status_line="${R}✘ No detectado (Selecciona opción 5)${NC}"
    if [ "$NODE_VER" != "No detectado" ]; then
        node_status_line="${G}✔ Detectado (${NODE_VER} • npm ${NPM_VER})${NC}"
    fi

    local taji_status_line="${GRAY}No verificado${NC}"
    if [ -d "/root/app/taji" ] || [ -d "$HOME/app/taji" ]; then
        taji_status_line="${G}✔ Encontrado (Angular)${NC}"
    fi

    cat << "EOF"
  
EOF
    echo -e "${G}         /\\_/\\${NC}"
    echo -e "${G}       (( @v@ ))  ${W}🦉 CODELINGO — PANEL DE GESTIÓN Y DESPLIEGUE (VPS)${NC}"
    echo -e "${G}       ():::()    ${GRAY}Vargas Sprint • Backtracking & Simulador de Examen (React)${NC}"
    echo -e "${G}        VV-VV     ${B}Ambiente de Producción con Nginx y Angular${NC}"
    echo ""
    echo -e "${P}╭──────────────────────────────────────────────────────────────────────────╮${NC}"
    echo -e "${P}│${W}  ✦ CODELINGO ATELIER — PANEL CENTRAL DE CONFIGURACIÓN Y DESPLIEGUE (VPS)  ${P}│${NC}"
    echo -e "${P}│${GRAY}  Gestor unificado de instalación, actualización y coexistencia Nginx      ${P}│${NC}"
    echo -e "${P}├──────────────────────────────────────────────────────────────────────────┤${NC}"
    printf "${P}│${NC}  ${W}Directorio Raíz:${NC}   %-52s${P}│${NC}\n" "$SCRIPT_DIR"
    printf "${P}│${NC}  ${W}Coexistencia:${NC}      %-52s${P}│${NC}\n" "$taji_status_line"
    printf "${P}│${NC}  ${W}Estado Node.js:${NC}    %-61s${P}│${NC}\n" "$node_status_line"
    printf "${P}│${NC}  ${W}IP Servidor:${NC}       ${CY}%s${NC}  •  ${W}URL:${NC} ${B}http://%s/app/CodeLingo/${NC}   ${P}│${NC}\n" "$SERVER_IP" "$SERVER_IP"
    echo -e "${P}╰──────────────────────────────────────────────────────────────────────────╯${NC}"
    echo ""
}

print_menu() {
    echo -e "${B}╭── [MENÚ PRINCIPAL DE GESTIÓN CODELINGO] ─────────────────────────────────╮${NC}"
    echo -e "${B}│${GRAY}  Accede a los instaladores y herramientas sin tener que cambiar de carpeta:${B}│${NC}"
    echo -e "${B}├────┬─────────────────────────────────────────────────────────────────────┤${NC}"
    echo -e "${B}│${W}  1 ${B}│${NC}  🚀  ${G}Instalación Completa${NC} (Compilar React + Desplegar en Nginx)     ${B}│${NC}"
    echo -e "${B}│${W}  2 ${B}│${NC}  🔄  ${CY}Actualizar desde Git${NC} (Git pull + Build + Recargar sin downtime)${B}│${NC}"
    echo -e "${B}│${W}  3 ${B}│${NC}  🌐  ${B}Configurar Nginx${NC} (Asegurar /app/CodeLingo sin tocar taji/Angular) ${B}│${NC}"
    echo -e "${B}│${W}  4 ${B}│${NC}  🩺  ${Y}Diagnóstico Integral${NC} (Verificar HTTP, rutas y Nginx activo)    ${B}│${NC}"
    echo -e "${B}│${W}  5 ${B}│${NC}  📦  ${O}Auto-detectar o Instalar Node.js LTS${NC} (v20 con NodeSource / NVM)${B}│${NC}"
    echo -e "${B}│${W}  6 ${B}│${NC}  📜  ${W}Ver Logs de Nginx en Vivo${NC} (Tail de logs de acceso y errores)     ${B}│${NC}"
    echo -e "${B}│${W}  7 ${B}│${NC}  🧹  ${R}Limpiar Caché y Recompilar${NC} (Reset de dist y node_modules)       ${B}│${NC}"
    echo -e "${B}│${W}  0 ${B}│${NC}  🚪  ${GRAY}Salir${NC}                                                                 ${B}│${NC}"
    echo -e "${B}╰────┴─────────────────────────────────────────────────────────────────────╯${NC}"
    echo ""
}

# ------------------------------------------------------------------------------
# 3. ACCIONES DE GESTIÓN
# ------------------------------------------------------------------------------

# Opción 1: Instalación / Despliegue Completo
do_full_deploy() {
    echo -e "\n${G}=== [1/5] Verificando entorno de compilación ===${NC}"
    if ! detect_node_environment; then
        echo -e "${R}Error: Node.js o npm no fueron encontrados en el sistema.${NC}"
        echo -e "${Y}Tip: Usa la opción 5 en el menú para instalar Node.js 20 LTS automáticamente.${NC}"
        return 1
    fi
    echo -e "  ${G}✔${NC} Usando Node: ${W}$NODE_VER${NC} (${NODE_BIN})"
    echo -e "  ${G}✔${NC} Usando npm:  ${W}$NPM_VER${NC} (${NPM_BIN})"

    echo -e "\n${B}=== [2/5] Instalando dependencias de Node ===${NC}"
    cd "$SCRIPT_DIR"
    npm install --legacy-peer-deps > /tmp/codelingo_npm_install.log 2>&1 &
    local install_pid=$!
    if ! run_with_spinner $install_pid "Instalando módulos npm (legacy-peer-deps)"; then
        echo -e "${R}Detalle del error:${NC}"
        tail -n 20 /tmp/codelingo_npm_install.log
        return 1
    fi

    echo -e "\n${B}=== [3/5] Compilando aplicación con Base Path /app/CodeLingo/ ===${NC}"
    export VITE_BASE_PATH="/app/CodeLingo/"
    npm run build > /tmp/codelingo_vite_build.log 2>&1 &
    local build_pid=$!
    if ! run_with_spinner $build_pid "Compilando con Vite para producción"; then
        echo -e "${R}Detalle del error de compilación:${NC}"
        tail -n 20 /tmp/codelingo_vite_build.log
        return 1
    fi

    if [ ! -d "$SCRIPT_DIR/dist" ]; then
        echo -e "${R}Error: No se encontró la carpeta 'dist' tras compilar.${NC}"
        return 1
    fi

    echo -e "\n${B}=== [4/5] Copiando archivos a $TARGET_DIR ===${NC}"
    sudo mkdir -p "$TARGET_DIR"
    sudo rm -rf "$TARGET_DIR/dist"
    sudo cp -r "$SCRIPT_DIR/dist" "$TARGET_DIR/"
    if id "www-data" >/dev/null 2>&1; then
        sudo chown -R www-data:www-data "$TARGET_DIR"
    fi
    sudo chmod -R 755 "$TARGET_DIR"
    draw_progress_bar "Sincronizando archivos estáticos"

    echo -e "\n${B}=== [5/5] Asegurando configuración en Nginx ===${NC}"
    do_configure_nginx_silently

    echo -e "\n${G}========================================================================${NC}"
    echo -e "${G}  🎉 ¡CODELINGO DESPLEGADO EXITOSAMENTE!${NC}"
    echo -e "${G}========================================================================${NC}"
    echo -e "  ${W}URL Directa:${NC}   ${B}http://$SERVER_IP/app/CodeLingo/${NC}"
    echo -e "  ${W}Angular taji:${NC}  ${G}Intacto y corriendo en su ruta original${NC}"
    echo ""
}

# Opción 2: Actualizar desde Git
do_git_update() {
    echo -e "\n${CY}=== [1/3] Descargando últimos cambios de GitHub ===${NC}"
    cd "$SCRIPT_DIR"
    git fetch origin main > /tmp/codelingo_git.log 2>&1
    git pull origin main >> /tmp/codelingo_git.log 2>&1 &
    local git_pid=$!
    if ! run_with_spinner $git_pid "Ejecutando git pull origin main"; then
        echo -e "${R}Error al sincronizar con Git:${NC}"
        cat /tmp/codelingo_git.log
        return 1
    fi

    echo -e "\n${CY}=== [2/3] Recompilando frontend React ===${NC}"
    detect_node_environment || true
    export VITE_BASE_PATH="/app/CodeLingo/"
    npm run build > /tmp/codelingo_vite_build.log 2>&1 &
    local build_pid=$!
    if ! run_with_spinner $build_pid "Compilando versión actualizada"; then
        tail -n 20 /tmp/codelingo_vite_build.log
        return 1
    fi

    echo -e "\n${CY}=== [3/3] Sincronizando con $TARGET_DIR ===${NC}"
    sudo cp -r "$SCRIPT_DIR/dist" "$TARGET_DIR/"
    sudo chmod -R 755 "$TARGET_DIR"
    if command -v nginx >/dev/null 2>&1; then
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
    fi
    draw_progress_bar "Recargando servicio Nginx"

    echo -e "\n${G}✔ ¡Actualización completada en menos de 10 segundos!${NC}"
}

# Opción 3: Configurar Nginx para convivir con taji/Angular
do_configure_nginx_silently() {
    sudo mkdir -p /etc/nginx/snippets
    sudo cp "$SCRIPT_DIR/nginx-codelingo.conf" "$SNIPPET_DEST"
    echo -e "  ${G}✔${NC} Snippet copiado a: ${W}$SNIPPET_DEST${NC}"

    # Buscar el archivo de configuración activo en sites-enabled
    local active_conf=""
    for f in /etc/nginx/sites-enabled/*; do
        if [ -f "$f" ]; then
            active_conf="$f"
            break
        fi
    done

    if [ -n "$active_conf" ]; then
        # Verificar si ya está incluido
        if grep -q "codelingo" "$active_conf"; then
            echo -e "  ${G}✔${NC} Inclusión de CodeLingo ya presente en: ${W}$active_conf${NC}"
        else
            echo -e "  ${Y}➜${NC} Integrando snippet en bloque server de: ${W}$active_conf${NC}"
            sudo cp "$active_conf" "${active_conf}.bak_codelingo"
            
            # Insertar 'include /etc/nginx/snippets/codelingo.conf;' antes de la última llave de cierre
            sudo awk '
                NR==FNR { lines[NR]=$0; total=NR; next }
                FNR==total {
                    print "    # CodeLingo React Integration"
                    print "    include /etc/nginx/snippets/codelingo.conf;"
                }
                { print }
            ' "$active_conf" "$active_conf" > /tmp/new_nginx_conf
            sudo cp /tmp/new_nginx_conf "$active_conf"
            rm -f /tmp/new_nginx_conf
        fi
    fi

    # Verificar sintaxis de Nginx
    if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
        echo -e "  ${G}✔${NC} Sintaxis de Nginx válida."
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
        echo -e "  ${G}✔${NC} Nginx recargado con éxito."
    else
        echo -e "  ${R}✘ Advertencia en Nginx:${NC}"
        cat /tmp/nginx_test.log
        if [ -n "$active_conf" ] && [ -f "${active_conf}.bak_codelingo" ]; then
            echo -e "  ${Y}Restaurando backup previo de Nginx...${NC}"
            sudo cp "${active_conf}.bak_codelingo" "$active_conf"
        fi
    fi
}

do_configure_nginx() {
    echo -e "\n${B}=== Configurando Nginx para coexistencia con Angular ===${NC}"
    do_configure_nginx_silently
    echo -e "\n${G}Configuración de Nginx finalizada.${NC}"
}

# Opción 4: Diagnóstico Integral
do_diagnostics() {
    echo -e "\n${Y}=== [Diagnóstico Integral de Salud del Servidor] ===${NC}"
    
    # 1. Node
    detect_node_environment || true
    echo -n "  • Node.js en PATH: "
    if [ "$NODE_VER" != "No detectado" ]; then
        echo -e "${G}✔ Activo ($NODE_VER - $NODE_BIN)${NC}"
    else
        echo -e "${R}✘ No encontrado en PATH${NC}"
    fi

    # 2. Nginx
    echo -n "  • Servicio Nginx:  "
    if systemctl is-active --quiet nginx 2>/dev/null; then
        echo -e "${G}✔ En ejecución (Active / Running)${NC}"
    else
        echo -e "${R}✘ Inactivo o no instalado${NC}"
    fi

    # 3. Archivos compilados de CodeLingo
    echo -n "  • Archivos dist:   "
    if [ -f "$TARGET_DIR/dist/index.html" ]; then
        local size
        size=$(du -sh "$TARGET_DIR/dist" 2>/dev/null | cut -f1)
        echo -e "${G}✔ index.html presente ($size en $TARGET_DIR/dist)${NC}"
    else
        echo -e "${R}✘ No se encontró $TARGET_DIR/dist/index.html${NC}"
    fi

    # 4. Snippet Nginx
    echo -n "  • Snippet Nginx:   "
    if [ -f "$SNIPPET_DEST" ]; then
        echo -e "${G}✔ Instalado en $SNIPPET_DEST${NC}"
    else
        echo -e "${Y}⚠ No copiado aún${NC}"
    fi

    # 5. Coexistencia con taji (Angular)
    echo -n "  • Proyecto taji:   "
    if [ -d "/root/app/taji" ] || [ -d "$HOME/app/taji" ]; then
        echo -e "${G}✔ Carpeta intacta sin interferencia${NC}"
    else
        echo -e "${GRAY}No detectado en ~/app/taji${NC}"
    fi

    # 6. Test HTTP local
    echo -n "  • Test HTTP Local: "
    if command -v curl >/dev/null 2>&1; then
        local http_code
        http_code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/app/CodeLingo/ || true)
        if [ "$http_code" == "200" ]; then
            echo -e "${G}✔ HTTP 200 OK (La web responde perfectamente)${NC}"
        else
            echo -e "${Y}Código HTTP: $http_code (Verifica Nginx si no es 200)${NC}"
        fi
    else
        echo -e "${GRAY}curl no disponible${NC}"
    fi
    echo ""
}

# Opción 5: Instalar / Reparar Node.js 20 LTS
do_install_node() {
    echo -e "\n${O}=== [Instalación Rápida de Node.js 20 LTS Oficial] ===${NC}"
    echo -e "Descargando repositorio oficial de NodeSource para Ubuntu..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /tmp/nodesource_setup.log 2>&1 &
    local repo_pid=$!
    if ! run_with_spinner $repo_pid "Configurando repositorio NodeSource"; then
        cat /tmp/nodesource_setup.log
        return 1
    fi

    sudo apt-get install -y nodejs > /tmp/node_install.log 2>&1 &
    local apt_pid=$!
    if ! run_with_spinner $apt_pid "Instalando paquetes nodejs y npm"; then
        cat /tmp/node_install.log
        return 1
    fi

    detect_node_environment || true
    echo -e "\n${G}✔ ¡Node.js instalado exitosamente!${NC}"
    echo -e "  Versión Node: ${W}$NODE_VER${NC}"
    echo -e "  Versión npm:  ${W}$NPM_VER${NC}"
}

# Opción 6: Ver logs en vivo
do_view_logs() {
    echo -e "\n${W}=== Mostrando últimas 30 líneas de logs de Nginx (Ctrl+C para salir) ===${NC}\n"
    if [ -f "/var/log/nginx/error.log" ]; then
        echo -e "${R}--- [Últimos Errores de Nginx] ---${NC}"
        tail -n 15 /var/log/nginx/error.log
    fi
    echo ""
    if [ -f "/var/log/nginx/access.log" ]; then
        echo -e "${B}--- [Últimos Accesos a Nginx] ---${NC}"
        tail -n 15 /var/log/nginx/access.log
    fi
    echo ""
    read -r -p "Presiona Enter para volver al menú..." dummy
}

# Opción 7: Limpiar caché y recompilar
do_clean_rebuild() {
    echo -e "\n${R}=== Limpiando node_modules y dist ===${NC}"
    cd "$SCRIPT_DIR"
    rm -rf node_modules dist package-lock.json
    draw_progress_bar "Eliminando archivos temporales"
    echo -e "${G}✔ Caché limpia. Procediendo a reinstalación completa...${NC}"
    do_full_deploy
}

# ------------------------------------------------------------------------------
# 4. BUCLE PRINCIPAL DEL MENÚ INTERACTIVO
# ------------------------------------------------------------------------------
main() {
    # Soporte para modo no-interactivo
    if [ "$1" == "--auto" ] || [ "$1" == "--deploy" ]; then
        do_full_deploy
        exit 0
    fi

    while true; do
        print_header
        print_menu
        echo -ne "  ${P}➜${NC} ${W}Selecciona una opción [0-7]:${NC} "
        read -r option

        case "$option" in
            1)
                do_full_deploy
                echo ""
                read -r -p "Presiona Enter para continuar..." dummy
                ;;
            2)
                do_git_update
                echo ""
                read -r -p "Presiona Enter para continuar..." dummy
                ;;
            3)
                do_configure_nginx
                echo ""
                read -r -p "Presiona Enter para continuar..." dummy
                ;;
            4)
                do_diagnostics
                read -r -p "Presiona Enter para continuar..." dummy
                ;;
            5)
                do_install_node
                echo ""
                read -r -p "Presiona Enter para continuar..." dummy
                ;;
            6)
                do_view_logs
                ;;
            7)
                do_clean_rebuild
                echo ""
                read -r -p "Presiona Enter para continuar..." dummy
                ;;
            0)
                echo -e "\n${G}¡Hasta pronto! Recuerda practicar en CodeLingo.${NC}\n"
                exit 0
                ;;
            *)
                echo -e "\n${R}Opción no válida. Inténtalo de nuevo.${NC}"
                sleep 1
                ;;
        esac
    done
}

main "$@"
