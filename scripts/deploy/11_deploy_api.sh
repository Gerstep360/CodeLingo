#!/usr/bin/env bash
# Deploy API code, preserve server secrets/data, apply additive migrations.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST=/var/www/CodeLingo/backend
sudo test -f "$DEST/.env" || { echo "Primero ejecuta la opcion 10 (instalar API y SQLite)."; exit 1; }
command -v composer >/dev/null
command -v rsync >/dev/null
sudo mkdir -p "$DEST"
if [[ "$(realpath "$ROOT/backend")" != "$(realpath "$DEST")" ]]; then
    sudo rsync -a --exclude=.env --exclude='.env.*' --exclude=vendor --exclude=storage --exclude=tests --exclude='*.sqlite*' --exclude=.git "$ROOT/backend/" "$DEST/"
fi
sudo mkdir -p "$DEST/storage/framework/cache/data" "$DEST/storage/framework/sessions" "$DEST/storage/framework/views" "$DEST/storage/logs" "$DEST/bootstrap/cache"
cd "$DEST"
sudo env COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
sudo php artisan config:clear
if sudo grep -q '^APP_KEY=$' .env; then sudo php artisan key:generate --force; fi
sudo php artisan migrate --force
sudo php artisan config:cache
sudo php artisan route:cache
# Application code read-only for PHP; only runtime directories are writable.
sudo chown -R root:www-data "$DEST"
sudo find "$DEST" -type d -exec chmod 750 {} +
sudo find "$DEST" -type f -exec chmod 640 {} +
sudo chown -R www-data:www-data "$DEST/storage" "$DEST/bootstrap/cache"
sudo chmod 640 "$DEST/.env"
if [[ "$(sudo php artisan codelingo:storage --field=driver)" == "sqlite" ]]; then
    DB_FILE="$(sudo php artisan codelingo:storage --field=path)"
    DB_FILE="$(realpath "$DB_FILE")"
    case "$DB_FILE" in
        "$DEST"/*) ;;
        *) echo "SQLite apunta fuera del backend desplegado: $DB_FILE. Ajusta DB_DATABASE a una copia accesible dentro de $DEST antes de activar la API."; exit 1 ;;
    esac
    sudo chown root:www-data "$(dirname "$DB_FILE")"
    sudo chmod 770 "$(dirname "$DB_FILE")"
    for suffix in '' '-wal' '-shm'; do
        if sudo test -f "${DB_FILE}${suffix}"; then sudo chown www-data:www-data "${DB_FILE}${suffix}"; sudo chmod 660 "${DB_FILE}${suffix}"; fi
    done
fi
echo "API actualizada; secretos y datos existentes conservados."
