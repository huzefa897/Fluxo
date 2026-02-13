#!/usr/bin/env bash
set -euo pipefail

# 1) backup first
./backup.sh

# 2) pull + restart
docker compose --env-file .env pull
docker compose --env-file .env up -d
