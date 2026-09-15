#!/usr/bin/env bash
# First-time API prerequisites and SQLite database. Run on the VPS.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST=/var/www/CodeLingo/backend
if ! command -v apt-get >/dev/null; then
    echo "Este instalador requiere Debian/Ubuntu. Instala PHP >= 8.3, PHP-FPM, SQLite, Composer y rsync manualmente."; exit 1
fi
sudo apt-get update
sudo apt-get install -y php-cli php-fpm php-sqlite3 php-mbstring php-xml php-curl php-zip composer rsync unzip
php -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' || { echo "Se requiere PHP 8.3 o superior; la version de esta distribucion es anterior. No se modifico la base de datos."; exit 1; }
PHP_VERSION="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
sudo systemctl enable --now "php${PHP_VERSION}-fpm"
SOCKET="/run/php/php${PHP_VERSION}-fpm.sock"
[[ -S "$SOCKET" ]] || { echo "No se encontro el socket PHP-FPM: $SOCKET"; exit 1; }
sudo mkdir -p "$DEST" /etc/nginx/snippets
printf 'fastcgi_pass unix:%s;\n' "$SOCKET" | sudo tee /etc/nginx/snippets/codelingo-php.conf >/dev/null
if sudo test -f "$DEST/.env"; then
    echo "Se conserva backend/.env y la base existente. Ejecuta la opcion 1 para desplegar."; exit 0
fi
ENV_TEMP="$(mktemp)"
chmod 600 "$ENV_TEMP"
trap 'rm -f "$ENV_TEMP"' EXIT
php -r '$s=file_get_contents($argv[1]);$s=str_replace(["APP_ENV=local","APP_URL=http://127.0.0.1:8000","SESSION_SECURE_COOKIE=false","SESSION_PATH=/"],["APP_ENV=production","APP_URL=https://167.86.106.105/CodeLingo","SESSION_SECURE_COOKIE=true","SESSION_PATH=/CodeLingo"],$s);echo $s;' "$ROOT/backend/.env.example" > "$ENV_TEMP"
sudo install -o root -g www-data -m 640 "$ENV_TEMP" "$DEST/.env"
sudo mkdir -p "$DEST/storage/app"
sudo touch "$DEST/storage/app/codelingo.sqlite"
printf '\nDB_DATABASE=/var/www/CodeLingo/backend/storage/app/codelingo.sqlite\n' | sudo tee -a "$DEST/.env" >/dev/null
echo "API y SQLite preparadas. Ejecuta la opcion 1."
