#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - PANEL INTERACTIVO DE CONTROL Y DESPLIEGUE VPS (SIN EMOJIS)
# ==============================================================================
# Plataforma: Ubuntu / Debian (Nginx + Node.js)
# Soporte de encendido/apagado independiente sin tocar proyectos como taji (Angular).
# 100% Diseno ASCII y animaciones de terminal nativas.
# ==============================================================================

# Variables de entorno y rutas
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="/var/www/app/CodeLingo"
SNIPPET_DEST="/etc/nginx/snippets/codelingo.conf"
SERVER_IP="167.86.106.105"

# Paleta ANSI 256 colores para terminal
G="\033[38;5;82m"     # Verde
B="\033[38;5;39m"     # Azul
Y="\033[38;5;220m"    # Amarillo
O="\033[38;5;208m"    # Naranja
R="\033[38;5;196m"    # Rojo
P="\033[38;5;141m"    # Purpura
CY="\033[38;5;51m"    # Cyan
W="\033[1;37m"        # Blanco negrita
GRAY="\033[38;5;244m" # Gris
DIM="\033[2m"
NC="\033[0m"         # Reset

# Variables de deteccion
NODE_BIN=""
NPM_BIN=""
NODE_VER="No detectado"
NPM_VER="No detectado"

# ------------------------------------------------------------------------------
# 1. DETECCION INTELIGENTE DE NODE.JS Y NVM
# ------------------------------------------------------------------------------
detect_node_environment() {
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        NODE_BIN="$(command -v node)"
        NPM_BIN="$(command -v npm)"
        NODE_VER="$("$NODE_BIN" -v 2>/dev/null)"
        NPM_VER="$("$NPM_BIN" -v 2>/dev/null)"
        return 0
    fi

    local nvm_candidates=(
        "$HOME/.nvm"
        "/root/.nvm"
        "/usr/local/nvm"
        "/opt/nvm"
    )

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

    local bin_candidates
    bin_candidates=$(find /root/.nvm/versions/node /home/*/.nvm/versions/node /usr/local/bin /snap/bin -name "node" -type f -executable 2>/dev/null || true)

    for cand in $bin_candidates; do
        local cand_dir
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
# 2. ESTADO DEL SERVIDOR CODELINGO (ACTIVO / APAGADO)
# ------------------------------------------------------------------------------
is_codelingo_active() {
    if [ -f "$SNIPPET_DEST" ] && grep -q "maintenance.html" "$SNIPPET_DEST" 2>/dev/null; then
        return 1 # Apagado / Modo Mantenimiento
    fi
    if [ -f "$TARGET_DIR/dist/index.html" ]; then
        return 0 # Activo
    fi
    return 2 # No instalado
}

# ------------------------------------------------------------------------------
# 3. ANIMACIONES Y SPINNERS ASCII PUROS
# ------------------------------------------------------------------------------
run_ascii_spinner() {
    local pid=$1
    local message="$2"
    local spin=('|' '/' '-' '\\')
    local i=0
    
    tput civis 2>/dev/null || true
    while kill -0 "$pid" 2>/dev/null; do
        i=$(( (i + 1) % 4 ))
        printf "\r  ${B}[%s]${NC} %s... " "${spin[$i]}" "$message"
        sleep 0.1
    done
    wait "$pid"
    local exit_code=$?
    tput cnorm 2>/dev/null || true

    if [ $exit_code -eq 0 ]; then
        printf "\r  ${G}[OK]${NC} %s... ${G}Completado con exito.${NC}\n" "$message"
    else
        printf "\r  ${R}[FALLO]${NC} %s... ${R}Error (Codigo %d)${NC}\n" "$message" "$exit_code"
    fi
    return $exit_code
}

draw_ascii_progress() {
    local label="$1"
    local width=34
    local steps=30
    
    for ((s=0; s<=steps; s++)); do
        local pct=$(( s * 100 / steps ))
        local filled=$(( s * width / steps ))
        local empty=$(( width - filled ))
        local bar=""
        for ((f=0; f<filled; f++)); do bar="${bar}="; done
        for ((e=0; e<empty; e++)); do bar="${bar}."; done
        printf "\r  ${P}[>]${NC} %-26s ${B}[${G}%s${NC}${B}]${W} %3d%%${NC}" "$label" "$bar" "$pct"
        sleep 0.02
    done
    echo ""
}

# Animacion de inicio ASCII
play_ascii_intro() {
    clear
    local frames=(
"
        /\\_/\\
       ( o.o )       CODELINGO - VARGAS SPRINT
       (  -  )       Simulador de Examen & Memoria Muscular
       /  v  \\       Iniciando panel de administracion...
      ( |   | )
       (_)-(_)
"
"
        /\\_/\\
       ( -.- )       CODELINGO - VARGAS SPRINT
       (  -  )       Simulador de Examen & Memoria Muscular
       /  v  \\       Comprobando configuracion de Nginx...
      ( |   | )
       (_)-(_)
"
"
        /\\_/\\
       ( ^.^ )       CODELINGO - VARGAS SPRINT
       (  o  )       Simulador de Examen & Memoria Muscular
       <  v  >       Entorno preparado. Listo para operar.
      ( |   | )
       (_)-(_)
"
    )
    for frame in "${frames[@]}"; do
        clear
        echo -e "${G}$frame${NC}"
        sleep 0.12
    done
}

# ------------------------------------------------------------------------------
# 4. CABECERA Y MENU PRINCIPAL
# ------------------------------------------------------------------------------
print_header() {
    clear
    detect_node_environment || true

    local node_status="[X] No detectado (Opcion 7 para instalar)"
    if [ "$NODE_VER" != "No detectado" ]; then
        node_status="[OK] ${NODE_VER} (npm ${NPM_VER})"
    fi

    local taji_status="[--] No verificado"
    if [ -d "/root/app/taji" ] || [ -d "$HOME/app/taji" ]; then
        taji_status="[OK] Angular (taji) intacto"
    fi

    local web_status="${G}[ACTIVO] Disponible en http://${SERVER_IP}/app/CodeLingo/${NC}"
    if ! is_codelingo_active; then
        web_status="${R}[APAGADO] Modo Mantenimiento (Acceso bloqueado)${NC}"
    fi

    cat << "EOF"
  
EOF
    echo -e "${G}        /\\_/\\${NC}"
    echo -e "${G}       ( o.o )  ${W}CODELINGO - PANEL DE GESTION Y DESPLIEGUE VPS${NC}"
    echo -e "${G}       (  -  )  ${GRAY}Vargas Sprint | Backtracking & Simulador (React + Nginx)${NC}"
    echo -e "${G}       /  v  \\  ${B}Arquitectura Multicontenedor / Convivencia con Angular${NC}"
    echo -e "${G}      ( |   | )${NC}"
    echo -e "${G}       (_)-(_)${NC}"
    echo ""
    echo -e "${P}+--------------------------------------------------------------------------+${NC}"
    echo -e "${P}|${W}  [*] ESTADO GENERAL DEL SISTEMA VPS                                      ${P}|${NC}"
    echo -e "${P}+--------------------------------------------------------------------------+${NC}"
    printf "${P}|${NC}  ${W}Directorio App:${NC}      %-51s${P}|${NC}\n" "$SCRIPT_DIR"
    printf "${P}|${NC}  ${W}Coexistencia:${NC}        %-51s${P}|${NC}\n" "$taji_status"
    printf "${P}|${NC}  ${W}Estado Node.js:${NC}      %-51s${P}|${NC}\n" "$node_status"
    printf "${P}|${NC}  ${W}Estado CodeLingo:${NC}    %-60s${P}|${NC}\n" "$web_status"
    echo -e "${P}+--------------------------------------------------------------------------+${NC}"
    echo ""
}

print_menu() {
    echo -e "${B}+-- [MENU DE GESTION CODELINGO] -------------------------------------------+${NC}"
    echo -e "${B}|${GRAY}  Seleccione una accion para ejecutar directamente en el servidor:        ${B}|${NC}"
    echo -e "${B}+----+---------------------------------------------------------------------+${NC}"
    echo -e "${B}|${W}  1 ${B}|${NC}  [>]  ${G}Despliegue Completo${NC} (Compilar React y activar en Nginx)         ${B}|${NC}"
    echo -e "${B}|${W}  2 ${B}|${NC}  [>]  ${CY}Actualizar desde Git${NC} (Git pull + Build + Recargar produccion)   ${B}|${NC}"
    echo -e "${B}|${W}  3 ${B}|${NC}  [>]  ${B}Configurar Nginx${NC} (Asegurar /app/CodeLingo sin tocar taji)      ${B}|${NC}"
    echo -e "${B}|${W}  4 ${B}|${NC}  [!]  ${R}APAGAR SERVIDOR / OCULTAR WEB${NC} (Modo Mantenimiento seguro)       ${B}|${NC}"
    echo -e "${B}|${W}  5 ${B}|${NC}  [*]  ${G}ENCENDER SERVIDOR / ACTIVAR WEB${NC} (Reanudar simulador)            ${B}|${NC}"
    echo -e "${B}|${W}  6 ${B}|${NC}  [?]  ${Y}Diagnostico Integral${NC} (Verificar HTTP 200, Nginx y rutas)        ${B}|${NC}"
    echo -e "${B}|${W}  7 ${B}|${NC}  [+]  ${O}Instalar / Reparar Node.js${NC} (Instalar v20 LTS oficial)          ${B}|${NC}"
    echo -e "${B}|${W}  8 ${B}|${NC}  [#]  ${W}Ver Logs de Nginx en Vivo${NC} (Ultimos accesos y errores)           ${B}|${NC}"
    echo -e "${B}|${W}  9 ${B}|${NC}  [X]  ${R}Limpiar Cache y Reset Total${NC} (node_modules y dist)               ${B}|${NC}"
    echo -e "${B}|${W}  0 ${B}|${NC}  [-]  ${GRAY}Salir del Administrador${NC}                                         ${B}|${NC}"
    echo -e "${B}+----+---------------------------------------------------------------------+${NC}"
    echo ""
}

# ------------------------------------------------------------------------------
# 5. MODULO DE APAGADO Y ENCENDIDO DEL SERVICIO
# ------------------------------------------------------------------------------

# Crear pagina de mantenimiento estatica en ASCII
create_maintenance_page() {
    sudo mkdir -p "$TARGET_DIR/dist"
    cat << "EOF" | sudo tee "$TARGET_DIR/dist/maintenance.html" > /dev/null
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeLingo - En Mantenimiento</title>
    <style>
        body {
            background-color: #0F172A;
            color: #F8FAFC;
            font-family: 'Courier New', Courier, monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .box {
            border: 2px solid #38BDF8;
            background: #1E293B;
            padding: 28px 34px;
            border-radius: 8px;
            max-width: 620px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            line-height: 1.5;
        }
        pre {
            color: #4ADE80;
            font-size: 13px;
            margin: 0 0 16px 0;
        }
        h2 {
            color: #F87171;
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        p {
            font-size: 13px;
            color: #94A3B8;
            margin: 6px 0;
        }
        .status-badge {
            display: inline-block;
            background: rgba(248, 113, 113, 0.15);
            color: #F87171;
            border: 1px solid #F87171;
            padding: 3px 8px;
            font-size: 11px;
            border-radius: 4px;
            font-weight: bold;
            margin-bottom: 12px;
        }
    </style>
</head>
<body>
    <div class="box">
        <pre>
        /\_/\
       ( -.- )  CODELINGO - VARGAS SPRINT
       (  -  )  Modo Fuera de Linea
       /  v  \
        </pre>
        <span class="status-badge">[!] SERVICIO TEMPORALMENTE PAUSADO</span>
        <h2>Simulador de Examen no disponible actualmente</h2>
        <p>El acceso a CodeLingo ha sido suspendido temporalmente por el administrador.</p>
        <p>Los demas servicios del servidor continúan funcionando con normalidad.</p>
    </div>
</body>
</html>
EOF
    sudo chmod 644 "$TARGET_DIR/dist/maintenance.html"
}

# Apagar / Desactivar CodeLingo (Modo Mantenimiento)
do_turn_off_server() {
    echo -e "\n${R}=== [APAGAR CODELINGO - DESACTIVAR SERVIDOR] ===${NC}"
    echo -e "Generando plantilla de mantenimiento limpia..."
    create_maintenance_page

    # Reescribir snippet Nginx a modo Mantenimiento
    sudo tee "$SNIPPET_DEST" > /dev/null << "EOF"
# ==============================================================================
# CodeLingo - ESTADO: APAGADO / MODO MANTENIMIENTO
# ==============================================================================
location ^~ /app/CodeLingo {
    alias /var/www/app/CodeLingo/dist/;
    index maintenance.html;
    try_files /maintenance.html =503;

    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
}
EOF
    sudo chmod 644 "$SNIPPET_DEST"

    if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
        draw_ascii_progress "Desactivando rutas en Nginx"
        echo -e "\n${Y}[OK] CodeLingo esta ahora APAGADO y FUERA DE LINEA.${NC}"
        echo -e "  Cualquier intento de acceso a /app/CodeLingo mostrara la pantalla de mantenimiento."
        echo -e "  ${G}Tu aplicacion Angular (taji) en la raiz sigue funcionando sin afectacion.${NC}"
    else
        echo -e "\n${R}[FALLO] Error al recargar Nginx:${NC}"
        cat /tmp/nginx_test.log
    fi
}

# Encender / Activar CodeLingo (Modo Normal)
do_turn_on_server() {
    echo -e "\n${G}=== [ENCENDER CODELINGO - ACTIVAR SERVIDOR] ===${NC}"
    
    # Restaurar snippet original de produccion
    sudo tee "$SNIPPET_DEST" > /dev/null << "EOF"
# ==============================================================================
# CodeLingo - ESTADO: ACTIVO / PRODUCCION
# ==============================================================================
location ^~ /app/CodeLingo {
    alias /var/www/app/CodeLingo/dist/;
    index index.html;
    try_files $uri $uri/ /app/CodeLingo/index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}

location ^~ /app/CodeLingo/assets/ {
    alias /var/www/app/CodeLingo/dist/assets/;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}
EOF
    sudo chmod 644 "$SNIPPET_DEST"

    if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
        draw_ascii_progress "Reactivando rutas en Nginx"
        echo -e "\n${G}[OK] CodeLingo esta nuevamente ACTIVO y ONLINE.${NC}"
        echo -e "  Accede en: ${B}http://$SERVER_IP/app/CodeLingo/${NC}"
    else
        echo -e "\n${R}[FALLO] Error al recargar Nginx:${NC}"
        cat /tmp/nginx_test.log
    fi
}

# ------------------------------------------------------------------------------
# 6. OPERACIONES DE DESPLIEGUE Y GIT
# ------------------------------------------------------------------------------

# Despliegue completo
do_full_deploy() {
    echo -e "\n${G}=== [1/5] Verificando entorno de compilacion ===${NC}"
    if ! detect_node_environment; then
        echo -e "${R}[ERROR] Node.js o npm no fueron encontrados.${NC}"
        echo -e "${Y}Sugerencia: Selecciona la opcion 7 para instalar Node.js 20 LTS.${NC}"
        return 1
    fi
    echo -e "  [OK] Node: $NODE_VER ($NODE_BIN)"
    echo -e "  [OK] npm:  $NPM_VER ($NPM_BIN)"

    echo -e "\n${B}=== [2/5] Instalando dependencias de Node ===${NC}"
    cd "$SCRIPT_DIR"
    npm install --legacy-peer-deps > /tmp/codelingo_npm.log 2>&1 &
    local install_pid=$!
    if ! run_ascii_spinner $install_pid "Instalando paquetes npm en segundo plano"; then
        echo -e "${R}Ultimas lineas del registro:${NC}"
        tail -n 12 /tmp/codelingo_npm.log
        return 1
    fi

    echo -e "\n${B}=== [3/5] Compilando frontend React para /app/CodeLingo/ ===${NC}"
    export VITE_BASE_PATH="/app/CodeLingo/"
    npm run build > /tmp/codelingo_vite.log 2>&1 &
    local build_pid=$!
    if ! run_ascii_spinner $build_pid "Compilando modulos con Vite"; then
        echo -e "${R}Ultimas lineas del registro de build:${NC}"
        tail -n 12 /tmp/codelingo_vite.log
        return 1
    fi

    if [ ! -d "$SCRIPT_DIR/dist" ]; then
        echo -e "${R}[ERROR] No se genero el directorio dist.${NC}"
        return 1
    fi

    echo -e "\n${B}=== [4/5] Desplegando archivos a $TARGET_DIR ===${NC}"
    sudo mkdir -p "$TARGET_DIR"
    sudo rm -rf "$TARGET_DIR/dist"
    sudo cp -r "$SCRIPT_DIR/dist" "$TARGET_DIR/"
    if id "www-data" >/dev/null 2>&1; then
        sudo chown -R www-data:www-data "$TARGET_DIR"
    fi
    sudo chmod -R 755 "$TARGET_DIR"
    draw_ascii_progress "Copiando bundle a /var/www"

    echo -e "\n${B}=== [5/5] Activando en Nginx ===${NC}"
    do_configure_nginx_silently
    do_turn_on_server

    echo -e "\n${G}+--------------------------------------------------------------------------+${NC}"
    echo -e "${G}|  [OK] DESPLIEGUE FINALIZADO CON EXITO                                    |${NC}"
    echo -e "${G}+--------------------------------------------------------------------------+${NC}"
    echo -e "  URL Activa:    ${B}http://$SERVER_IP/app/CodeLingo/${NC}"
    echo -e "  Angular taji:  ${G}Operando sin alteraciones en la raiz${NC}"
    echo ""
}

# Actualizar desde Git
do_git_update() {
    echo -e "\n${CY}=== [1/3] Sincronizando con GitHub (origin main) ===${NC}"
    cd "$SCRIPT_DIR"
    git fetch origin main > /tmp/codelingo_git.log 2>&1
    git pull origin main >> /tmp/codelingo_git.log 2>&1 &
    local git_pid=$!
    if ! run_ascii_spinner $git_pid "Descargando commits de Git"; then
        cat /tmp/codelingo_git.log
        return 1
    fi

    echo -e "\n${CY}=== [2/3] Recompilando aplicacion ===${NC}"
    detect_node_environment || true
    export VITE_BASE_PATH="/app/CodeLingo/"
    npm run build > /tmp/codelingo_vite.log 2>&1 &
    local build_pid=$!
    if ! run_ascii_spinner $build_pid "Compilando nueva version"; then
        tail -n 12 /tmp/codelingo_vite.log
        return 1
    fi

    echo -e "\n${CY}=== [3/3] Actualizando produccion ===${NC}"
    sudo cp -r "$SCRIPT_DIR/dist" "$TARGET_DIR/"
    sudo chmod -R 755 "$TARGET_DIR"
    if command -v nginx >/dev/null 2>&1; then
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
    fi
    draw_ascii_progress "Recargando servidor Nginx"

    echo -e "\n${G}[OK] Version actualizada sin tiempo de inactividad.${NC}"
}

# Configuracion Nginx interna
do_configure_nginx_silently() {
    sudo mkdir -p /etc/nginx/snippets
    sudo cp "$SCRIPT_DIR/nginx-codelingo.conf" "$SNIPPET_DEST"

    local active_conf=""
    for f in /etc/nginx/sites-enabled/*; do
        if [ -f "$f" ]; then
            active_conf="$f"
            break
        fi
    done

    if [ -n "$active_conf" ]; then
        if grep -q "codelingo" "$active_conf"; then
            echo -e "  [OK] Inclusión ya configurada en: $active_conf"
        else
            echo -e "  [>] Integrando snippet en bloque server de: $active_conf"
            sudo cp "$active_conf" "${active_conf}.bak_codelingo"
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

    if sudo nginx -t > /tmp/nginx_test.log 2>&1; then
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
    else
        echo -e "  ${R}[AVISO] Error de sintaxis en Nginx:${NC}"
        cat /tmp/nginx_test.log
        if [ -n "$active_conf" ] && [ -f "${active_conf}.bak_codelingo" ]; then
            sudo cp "${active_conf}.bak_codelingo" "$active_conf"
        fi
    fi
}

do_configure_nginx() {
    echo -e "\n${B}=== Configurando reglas de Nginx ===${NC}"
    do_configure_nginx_silently
    echo -e "${G}[OK] Reglas de Nginx aplicadas.${NC}"
}

# Diagnostico Integral
do_diagnostics() {
    echo -e "\n${Y}+-- [DIAGNOSTICO INTEGRAL DE SALUD DEL SERVIDOR] -------------------------+${NC}"
    
    detect_node_environment || true
    echo -n "  • Node.js en PATH: "
    if [ "$NODE_VER" != "No detectado" ]; then
        echo -e "${G}[OK] $NODE_VER ($NODE_BIN)${NC}"
    else
        echo -e "${R}[FALLO] No encontrado${NC}"
    fi

    echo -n "  • Servicio Nginx:  "
    if systemctl is-active --quiet nginx 2>/dev/null; then
        echo -e "${G}[OK] Activo y en ejecucion${NC}"
    else
        echo -e "${R}[FALLO] Inactivo o detenido${NC}"
    fi

    echo -n "  • Archivos web:    "
    if [ -f "$TARGET_DIR/dist/index.html" ]; then
        local sz
        sz=$(du -sh "$TARGET_DIR/dist" 2>/dev/null | cut -f1)
        echo -e "${G}[OK] index.html presente ($sz)${NC}"
    else
        echo -e "${R}[FALLO] No existe index.html en $TARGET_DIR/dist${NC}"
    fi

    echo -n "  • Estado Servicio: "
    if is_codelingo_active; then
        echo -e "${G}[ACTIVO] Enrutamiento normal habilitado${NC}"
    else
        echo -e "${Y}[APAGADO] Modo mantenimiento activo${NC}"
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
        code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/app/CodeLingo/ || true)
        if [ "$code" == "200" ]; then
            echo -e "${G}[OK] HTTP 200 (Respuesta exitosa)${NC}"
        else
            echo -e "${Y}Codigo HTTP: $code${NC}"
        fi
    else
        echo -e "${GRAY}[--] curl no disponible${NC}"
    fi
    echo -e "${Y}+--------------------------------------------------------------------------+${NC}\n"
}

# Instalar Node.js 20 LTS
do_install_node() {
    echo -e "\n${O}=== [Instalacion Oficial Node.js 20 LTS via NodeSource] ===${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /tmp/node_repo.log 2>&1 &
    local repo_pid=$!
    if ! run_ascii_spinner $repo_pid "Configurando repositorios"; then
        cat /tmp/node_repo.log
        return 1
    fi

    sudo apt-get install -y nodejs > /tmp/node_pkg.log 2>&1 &
    local apt_pid=$!
    if ! run_ascii_spinner $apt_pid "Instalando paquetes nodejs y npm"; then
        cat /tmp/node_pkg.log
        return 1
    fi

    detect_node_environment || true
    echo -e "\n${G}[OK] Node.js instalado con exito:${NC}"
    echo -e "  Version Node: $NODE_VER"
    echo -e "  Version npm:  $NPM_VER"
}

# Ver logs
do_view_logs() {
    echo -e "\n${W}=== Ultimos registros de Nginx (Presione Enter para regresar) ===${NC}\n"
    if [ -f "/var/log/nginx/error.log" ]; then
        echo -e "${R}[-- Errores Nginx --]${NC}"
        tail -n 12 /var/log/nginx/error.log
    fi
    echo ""
    if [ -f "/var/log/nginx/access.log" ]; then
        echo -e "${B}[-- Accesos Nginx --]${NC}"
        tail -n 12 /var/log/nginx/access.log
    fi
    echo ""
    read -r -p "Presione Enter para volver al menu..." dummy
}

# Limpiar cache y reset
do_clean_rebuild() {
    echo -e "\n${R}=== Limpiando node_modules y dist ===${NC}"
    cd "$SCRIPT_DIR"
    rm -rf node_modules dist package-lock.json
    draw_ascii_progress "Eliminando archivos temporales"
    echo -e "${G}[OK] Cache limpia. Procediendo a reinstalacion...${NC}"
    do_full_deploy
}

# ------------------------------------------------------------------------------
# 7. BUCLE PRINCIPAL
# ------------------------------------------------------------------------------
main() {
    # Intro animada en primera carga si es terminal interactiva
    if [ -t 1 ] && [ -z "$1" ]; then
        play_ascii_intro
    fi

    if [ "$1" == "--auto" ] || [ "$1" == "--deploy" ]; then
        do_full_deploy
        exit 0
    fi

    while true; do
        print_header
        print_menu
        echo -ne "  ${P}[?]${NC} ${W}Seleccione una opcion [0-9]:${NC} "
        read -r option

        case "$option" in
            1)
                do_full_deploy
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            2)
                do_git_update
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            3)
                do_configure_nginx
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            4)
                do_turn_off_server
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            5)
                do_turn_on_server
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            6)
                do_diagnostics
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            7)
                do_install_node
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            8)
                do_view_logs
                ;;
            9)
                do_clean_rebuild
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            0)
                echo -e "\n${G}[OK] Sesion finalizada. Hasta pronto.${NC}\n"
                exit 0
                ;;
            *)
                echo -e "\n${R}[!] Opcion no valida.${NC}"
                sleep 1
                ;;
        esac
    done
}

main "$@"
