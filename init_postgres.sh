#!/usr/bin/env bash
set -euo pipefail

# ---------------------------
# CONFIGURE THESE IF NEEDED
# ---------------------------
DB_NAME="fluxo"
DB_USER="fluxo_user"
DB_PASS="fluxo_pass"
DB_HOST="localhost"
DB_PORT="5432"
PG_SUPERUSER="postgres"   # admin user to connect as (often 'postgres')
# It will use your existing psql auth (PGPASSWORD/.pgpass). To use a password for PG_SUPERUSER:
# export PGPASSWORD="your_postgres_superuser_password"

echo "🚀 Setting up PostgreSQL: db=$DB_NAME user=$DB_USER on $DB_HOST:$DB_PORT"

# Ensure psql/createdb exist
command -v psql >/dev/null 2>&1 || { echo "❌ psql not found. Install PostgreSQL client."; exit 1; }
command -v createdb >/dev/null 2>&1 || { echo "❌ createdb not found. Install PostgreSQL client."; exit 1; }

# Helper to run psql as superuser
PSQL=(psql -h "$DB_HOST" -p "$DB_PORT" -U "$PG_SUPERUSER" -v ON_ERROR_STOP=1 -qAt)

# 1) Create role if missing
ROLE_EXISTS="$("${PSQL[@]}" -c "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'")" || true
if [[ "$ROLE_EXISTS" != "1" ]]; then
  echo "➕ Creating role '$DB_USER'..."
  "${PSQL[@]}" -c "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';"
else
  echo "ℹ️ Role '$DB_USER' already exists."
fi

# 2) Create database if missing
DB_EXISTS="$("${PSQL[@]}" -c "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'")" || true
if [[ "$DB_EXISTS" != "1" ]]; then
  echo "➕ Creating database '$DB_NAME'..."
  createdb -h "$DB_HOST" -p "$DB_PORT" -U "$PG_SUPERUSER" "$DB_NAME"
else
  echo "ℹ️ Database '$DB_NAME' already exists."
fi

# 3) Grant privileges on the database
echo "🔐 Granting privileges on '$DB_NAME' to '$DB_USER'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$PG_SUPERUSER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -qAt \
  -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# 4) Schema permissions and default privileges (tables + sequences)
psql -h "$DB_HOST" -p "$DB_PORT" -U "$PG_SUPERUSER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<SQL
-- Allow usage of public schema
GRANT USAGE ON SCHEMA public TO ${DB_USER};

-- Ensure access to current objects
GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};

-- Ensure access to future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${DB_USER};
SQL

# 5) Create tables (if they don’t exist) — aligned 1:1 with your JPA entity
echo "📦 Creating tables in '$DB_NAME'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$PG_SUPERUSER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<SQL
-- PRODUCTS TABLE (matches com.Inventory.Fluxo.models.products)
-- Uses SERIAL to align with JPA IDENTITY strategy out of the box.
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT,
  description TEXT,
  brand TEXT,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  expiry_date DATE,
  last_add_date DATE
);

-- Make ${DB_USER} the owner so your app user can ALTER, add indexes, etc.
ALTER TABLE products OWNER TO ${DB_USER};
SQL

echo "✅ Tables created (if not already present)."

echo "🎉 Done!"
echo "   JDBC: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
echo "   User: ${DB_USER}"

