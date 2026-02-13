#!/usr/bin/env bash
set -euo pipefail

TS=$(date +"%Y%m%d_%H%M%S")
FILE="fluxo_backup_${TS}.sql"

docker exec -t fluxo_db pg_dump -U "${POSTGRES_USER:-fluxo}" -d "${POSTGRES_DB:-fluxo}" > "$FILE"
echo "Backup created: $FILE"
