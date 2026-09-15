#!/usr/bin/env bash
set -euo pipefail
DEST=/var/www/CodeLingo/backend
sudo test -f "$DEST/.env" || { echo "API no desplegada. Ejecuta primero las opciones 10 y 1."; exit 1; }
cd "$DEST"
sudo -u www-data php artisan codelingo:admin
