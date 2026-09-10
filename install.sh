#!/usr/bin/env bash
# ==============================================================================
# CodeLingo - Script de Instalación y Despliegue en Servidor Nginx
# ==============================================================================
# Diseñado para convivir pacíficamente con aplicaciones Angular existentes.
# Despliega CodeLingo en /app/CodeLingo sin sobreescribir ni tocar Angular.
# ==============================================================================

set -e

# Colores para salida de consola
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   🦉 CodeLingo - Despliegue de Producción (React)   ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Definir rutas
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-/var/www/app/CodeLingo}"
NGINX_CONF_DEST="/etc/nginx/conf.d/codelingo.conf"

echo -e "${YELLOW}[1/5] Verificando dependencias de Node.js...${NC}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}Error: Node.js no está instalado. Instálalo antes de continuar.${NC}"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}Error: npm no está instalado.${NC}"
    exit 1
fi

echo -e "Node versión: $(node -v)"
echo -e "npm versión:  $(npm -v)"

# 2. Instalación de paquetes
echo -e "\n${YELLOW}[2/5] Instalando dependencias de npm...${NC}"
cd "$SCRIPT_DIR"
npm install --legacy-peer-deps

# 3. Compilación con Base Path para /app/CodeLingo
echo -e "\n${YELLOW}[3/5] Compilando aplicación con VITE_BASE_PATH=/app/CodeLingo/...${NC}"
export VITE_BASE_PATH="/app/CodeLingo/"
npm run build

if [ ! -d "$SCRIPT_DIR/dist" ]; then
    echo -e "${RED}Error: No se encontró la carpeta 'dist' después del build.${NC}"
    exit 1
fi

# 4. Copiar a la carpeta destino
echo -e "\n${YELLOW}[4/5] Copiando build a destino: $TARGET_DIR...${NC}"
sudo mkdir -p "$TARGET_DIR"
sudo cp -r "$SCRIPT_DIR/dist" "$TARGET_DIR/"

# Dar permisos al usuario del servidor web si www-data existe
if id "www-data" >/dev/null 2>&1; then
    sudo chown -R www-data:www-data "$TARGET_DIR"
fi
sudo chmod -R 755 "$TARGET_DIR"

# 5. Configuración de Nginx
echo -e "\n${YELLOW}[5/5] Configurando Nginx...${NC}"
if [ -d "/etc/nginx/conf.d" ]; then
    sudo cp "$SCRIPT_DIR/nginx-codelingo.conf" "$NGINX_CONF_DEST"
    echo -e "${GREEN}Archivo copiado a $NGINX_CONF_DEST${NC}"
fi

echo -e "\n${BLUE}Verificando sintaxis de Nginx:${NC}"
if command -v nginx >/dev/null 2>&1; then
    if sudo nginx -t; then
        echo -e "${GREEN}Sintaxis de Nginx válida.${NC}"
        echo -e "Recargando Nginx..."
        sudo systemctl reload nginx || sudo service nginx reload || true
        echo -e "${GREEN}¡Nginx recargado exitosamente!${NC}"
    else
        echo -e "${RED}Hubo una advertencia en Nginx. Revisa tu archivo de configuración principal.${NC}"
    fi
else
    echo -e "${YELLOW}Nginx no está instalado en este sistema o no está en el PATH.${NC}"
fi

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   ✅ CodeLingo desplegado con éxito en /app/CodeLingo${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "Accede desde tu navegador en: ${BLUE}http://TU_IP_O_DOMINIO/app/CodeLingo${NC}"
echo -e "Nota: Tu aplicación Angular en / sigue intacta sin modificaciones."
