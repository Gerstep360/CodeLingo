#!/usr/bin/env bash
# Deploy API code, preserve server secrets/data, apply additive migrations.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST=/var/www/CodeLingo/backend
sudo test -f "$DEST/.env" || { echo "Primero ejecuta la opcion 10 (instalar API y MySQL)."; exit 1; }
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
echo "API actualizada; secretos y datos existentes conservados."
