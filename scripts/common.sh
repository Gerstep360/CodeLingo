#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO COMUN DE CONFIGURACION, COLORES Y HELPERS (ASCII)
# ==============================================================================

# Variables de entorno y rutas globales
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="/var/www/CodeLingo"
SNIPPET_DEST="/etc/nginx/snippets/codelingo.conf"
SERVER_IP="167.86.106.105"

# Paleta ANSI 256 colores (formato bash $'\033[...' para máxima compatibilidad)
G=$'\033[38;5;82m'      # Verde
B=$'\033[38;5;39m'      # Azul
Y=$'\033[38;5;220m'     # Amarillo
O=$'\033[38;5;208m'     # Naranja
R=$'\033[38;5;196m'     # Rojo
P=$'\033[38;5;141m'     # Purpura
CY=$'\033[38;5;51m'     # Cyan
W=$'\033[1;37m'         # Blanco negrita
GRAY=$'\033[38;5;244m'  # Gris
DIM=$'\033[2m'
NC=$'\033[0m'          # Reset

NODE_BIN=""
NPM_BIN=""
NODE_VER="No detectado"
NPM_VER="No detectado"

# ------------------------------------------------------------------------------
# 1. DETECCION INTELIGENTE Y PROFUNDA DE NODE.JS (NVM, FNM, SYSTEM, SNAP)
# ------------------------------------------------------------------------------
detect_node_environment() {
    # 1.1 Si ya esta en el PATH activo
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        NODE_BIN="$(command -v node)"
        NPM_BIN="$(command -v npm)"
        NODE_VER="$("$NODE_BIN" -v 2>/dev/null || echo 'v?')"
        NPM_VER="$("$NPM_BIN" -v 2>/dev/null || echo 'v?')"
        return 0
    fi

    # 1.2 Buscar en ubicaciones estándar de NVM
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

    # 1.3 Buscar binarios directos en NVM, /usr/local/bin, /snap/bin, /usr/bin
    local bin_dirs=(
        /root/.nvm/versions/node/*/bin
        /home/*/.nvm/versions/node/*/bin
        /usr/local/bin
        /usr/bin
        /snap/bin
        /opt/node/bin
    )
    for dir in "${bin_dirs[@]}"; do
        if [ -x "$dir/node" ] && [ -x "$dir/npm" ]; then
            export PATH="$dir:$PATH"
            NODE_BIN="$dir/node"
            NPM_BIN="$dir/npm"
            NODE_VER="$("$NODE_BIN" -v 2>/dev/null)"
            NPM_VER="$("$NPM_BIN" -v 2>/dev/null)"
            return 0
        fi
    done

    return 1
}

# ------------------------------------------------------------------------------
# 2. ESTADO DEL SERVICIO CODELINGO (PRODUCCION / MANTENIMIENTO)
# ------------------------------------------------------------------------------
is_codelingo_active() {
    if [ -f "$SNIPPET_DEST" ] && grep -q "maintenance.html" "$SNIPPET_DEST" 2>/dev/null; then
        return 1 # Apagado / Modo Mantenimiento
    fi
    if [ -f "$TARGET_DIR/dist/index.html" ]; then
        return 0 # Activo
    fi
    return 2 # No instalado aun
}

# ------------------------------------------------------------------------------
# 3. SPINNERS Y BARRAS DE PROGRESO ASCII (CON TIMEOUT PARA EVITAR BUCLES)
# ------------------------------------------------------------------------------
run_ascii_spinner() {
    local pid=$1
    local label=$2
    local timeout_secs=${3:-90} # Timeout maximo por defecto 90s
    local spin_chars=('/' '-' '\' '|')
    local i=0
    local elapsed=0

    while kill -0 "$pid" 2>/dev/null; do
        printf "\r  ${P}[%s]${NC} %-32s ${GRAY}(%2ds)${NC}" "${spin_chars[i]}" "$label..." "$elapsed"
        i=$(( (i + 1) % 4 ))
        sleep 0.2
        elapsed=$(( elapsed + 1 ))

        # Proteccion contra procesos colgados
        if [ $elapsed -ge $(( timeout_secs * 5 )) ]; then
            kill -9 "$pid" 2>/dev/null || true
            wait "$pid" 2>/dev/null || true
            printf "\r  ${R}[TIMEOUT]${NC} %-32s ${R}(Excedio %ds)${NC}\n" "$label" "$timeout_secs"
            return 124
        fi
    done

    wait "$pid"
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        printf "\r  ${G}[OK]${NC} %-32s            \n" "$label"
        return 0
    else
        printf "\r  ${R}[FALLO]${NC} %-32s (Codigo: %d)   \n" "$label" "$exit_code"
        return $exit_code
    fi
}

draw_ascii_progress() {
    local label=$1
    local width=22
    for pct in 15 35 60 85 100; do
        local filled=$(( (pct * width) / 100 ))
        local empty=$(( width - filled ))
        local bar=""
        for ((f=0; f<filled; f++)); do bar="${bar}="; done
        for ((e=0; e<empty; e++)); do bar="${bar}."; done
        printf "\r  ${P}[>]${NC} %-28s ${B}[${G}%s${NC}${B}]${W} %3d%%${NC}" "$label" "$bar" "$pct"
        sleep 0.02
    done
    echo ""
}
