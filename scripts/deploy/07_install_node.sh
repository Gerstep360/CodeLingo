#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - MODULO 07: INSTALACION Y REPARACION INTELIGENTE DE NODE.JS (VPS)
# ==============================================================================
# Evita bloqueos de apt/NodeSource mediante auto-detección y descarga binaria directa.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../common.sh
source "$(dirname "${BASH_SOURCE[0]}")/../common.sh"

main() {
    echo -e "\n${O}=== [Modulo 07: Instalacion y Diagnostico de Node.js / npm] ===${NC}"

    # Paso 1: Intentar detectar instalacion existente
    echo -e "  • Buscando entornos Node.js existentes (PATH, NVM, snap, /usr/local)..."
    if detect_node_environment; then
        echo -e "\n${G}[OK] Node.js ya esta presente en el servidor:${NC}"
        echo -e "  Ubicacion: $NODE_BIN"
        echo -e "  Version Node: ${W}$NODE_VER${NC}"
        echo -e "  Version npm:  ${W}$NPM_VER${NC}"
        
        # Asegurar enlace en /usr/local/bin para que sudo y servicios globales lo vean siempre
        if [ ! -f "/usr/local/bin/node" ] && [ -x "$NODE_BIN" ]; then
            sudo ln -sf "$NODE_BIN" /usr/local/bin/node 2>/dev/null || true
            sudo ln -sf "$NPM_BIN" /usr/local/bin/npm 2>/dev/null || true
            echo -e "  ${G}[OK] Enlace simbolico creado en /usr/local/bin/node${NC}"
        fi
        return 0
    fi

    echo -e "  ${Y}[--] No se encontro Node.js funcional. Procediendo con instalacion segura...${NC}"

    # Paso 2: Instalacion directa oficial de Node.js v20 LTS x64 (Standalone)
    # Ventajas: No toca apt, no sufre por bloqueos de dpkg/unattended-upgrades, se instala en 5 segundos.
    local NODE_VERSION="v20.18.0"
    local ARCH="linux-x64"
    local TARBALL="node-${NODE_VERSION}-${ARCH}.tar.gz"
    local URL="https://nodejs.org/dist/${NODE_VERSION}/${TARBALL}"

    echo -e "  • Descargando paquete oficial directo (${NODE_VERSION} LTS para ${ARCH})..."
    mkdir -p /tmp/codelingo_node
    (
        set -e
        cd /tmp/codelingo_node
        if ! curl -fsSL -m 60 "$URL" -o "$TARBALL"; then
            echo "Mirror alternativo..." >&2
            curl -fsSL -m 60 "https://unofficial-builds.nodejs.org/download/release/${NODE_VERSION}/${TARBALL}" -o "$TARBALL"
        fi
        sudo tar -xzf "$TARBALL" --strip-components=1 -C /usr/local
    ) > /tmp/node_install.log 2>&1 &
    local local_pid=$!

    if ! run_ascii_spinner "$local_pid" "Instalando binarios oficiales Node.js" 60; then
        echo -e "\n${R}[FALLO] La instalacion binaria directa fallo. Registro:${NC}"
        cat /tmp/node_install.log
        
        # Fallback de rescate: Intentar con apt de Ubuntu
        echo -e "\n${Y}[RESCATE] Intentando via gestor de paquetes apt...${NC}"
        sudo killall -q apt apt-get dpkg 2>/dev/null || true
        sleep 1
        (
            export DEBIAN_FRONTEND=noninteractive
            sudo apt-get update -y
            sudo apt-get install -y nodejs npm
        ) > /tmp/node_apt.log 2>&1 &
        local apt_pid=$!
        if ! run_ascii_spinner "$apt_pid" "Instalando nodejs via apt" 60; then
            cat /tmp/node_apt.log
            echo -e "\n${R}[ERROR CRITICO] No se pudo instalar Node.js automaticamente.${NC}"
            echo -e "Verifique su conexion a internet o ejecute manualmente: apt install nodejs npm"
            return 1
        fi
    fi

    # Limpieza
    rm -rf /tmp/codelingo_node

    # Verificacion final
    export PATH="/usr/local/bin:$PATH"
    hash -r 2>/dev/null || true

    if detect_node_environment; then
        echo -e "\n${G}+--------------------------------------------------------------------------+${NC}"
        echo -e "${G}|  [OK] Node.js 20 LTS INSTALADO Y VERIFICADO CON EXITO                   |${NC}"
        echo -e "${G}+--------------------------------------------------------------------------+${NC}"
        echo -e "  Node: ${W}$NODE_VER${NC} (${NODE_BIN})"
        echo -e "  npm:  ${W}$NPM_VER${NC} (${NPM_BIN})"
        return 0
    else
        echo -e "\n${R}[FALLO] Node.js se descargo pero no responde en el PATH.${NC}"
        return 1
    fi
}

main "$@"
