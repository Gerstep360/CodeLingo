#!/usr/bin/env bash
# First-time API prerequisites and isolated MySQL account. Run on the VPS.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST=/var/www/CodeLingo/backend
if ! command -v apt-get >/dev/null; then
    echo "Este instalador requiere Debian/Ubuntu. Instala PHP >= 8.3, PHP-FPM, MySQL, Composer y rsync manualmente."; exit 1
fi
sudo apt-get update
sudo apt-get install -y php-cli php-fpm php-mysql php-mbstring php-xml php-curl php-zip mysql-server composer rsync unzip
php -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' || { echo "Se requiere PHP 8.3 o superior; la version de esta distribucion es anterior. No se modifico la base de datos."; exit 1; }
PHP_VERSION="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
sudo systemctl enable --now mysql "php${PHP_VERSION}-fpm"
SOCKET="/run/php/php${PHP_VERSION}-fpm.sock"
[[ -S "$SOCKET" ]] || { echo "No se encontro el socket PHP-FPM: $SOCKET"; exit 1; }
sudo mkdir -p "$DEST" /etc/nginx/snippets
printf 'fastcgi_pass unix:%s;\n' "$SOCKET" | sudo tee /etc/nginx/snippets/codelingo-php.conf >/dev/null
if sudo test -f "$DEST/.env"; then
    echo "Se conserva backend/.env y la base existente. Ejecuta la opcion 1 para desplegar."; exit 0
fi
# Hex-only generated secret is safe to pass to SQL through stdin; never printed.
DB_SECRET="$(php -r 'echo bin2hex(random_bytes(24));')"
printf "CREATE DATABASE IF NOT EXISTS codelingo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nCREATE USER IF NOT EXISTS 'codelingo'@'localhost' IDENTIFIED BY '%s';\nGRANT ALL PRIVILEGES ON codelingo.* TO 'codelingo'@'localhost';\n" "$DB_SECRET" | sudo mysql
ENV_TEMP="$(mktemp)"
chmod 600 "$ENV_TEMP"
trap 'rm -f "$ENV_TEMP"' EXIT
export DB_SECRET
php -r '$s=file_get_contents($argv[1]);$s=str_replace(["APP_ENV=local","APP_URL=http://127.0.0.1:8000","DB_PASSWORD=","SESSION_SECURE_COOKIE=false","SESSION_PATH=/"],["APP_ENV=production","APP_URL=https://167.86.106.105/CodeLingo","DB_PASSWORD=".getenv("DB_SECRET"),"SESSION_SECURE_COOKIE=true","SESSION_PATH=/CodeLingo"],$s);echo $s;' "$ROOT/backend/.env.example" > "$ENV_TEMP"
unset DB_SECRET
sudo install -o root -g www-data -m 640 "$ENV_TEMP" "$DEST/.env"
echo "API preparada. Credenciales guardadas en backend/.env; no se muestran en pantalla. Ejecuta la opcion 1."
