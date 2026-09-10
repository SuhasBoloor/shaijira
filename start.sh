#!/bin/bash
set -e

echo "Starting Redis..."
service redis-server start

echo "Starting PostgreSQL..."
service postgresql start

echo "Configuring PostgreSQL database & authentication..."
# Allow local connections inside the container
sed -i 's/scram-sha-256/trust/g' /etc/postgresql/*/main/pg_hba.conf 2>/dev/null || true
sed -i 's/md5/trust/g' /etc/postgresql/*/main/pg_hba.conf 2>/dev/null || true
su - postgres -c "psql -c 'SELECT pg_reload_conf();'" || true

# Set postgres user password to postgres
su - postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD 'postgres' SUPERUSER;\"" || true
su - postgres -c "psql -c \"CREATE DATABASE rbac_app OWNER postgres;\"" 2>/dev/null || true

# Initialize all database tables and types directly via SQL
echo "Applying database schema from init.sql..."
su - postgres -c "psql -d rbac_app -f /app/init.sql" || true

if [ -z "$DATABASE_URL" ]; then
    export DATABASE_URL="postgres://postgres:postgres@localhost:5432/rbac_app"
fi

if [ -z "$REDIS_URL" ]; then
    export REDIS_URL="redis://localhost:6379"
fi

if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET="shai-jira-secret-key-2026"
fi

if [ -z "$PORT" ]; then
    export PORT="3000"
fi

echo "Seeding baseline permissions and SuperAdmin..."
node src/seed.js || true

echo "Launching Shai-Jira on port $PORT..."
exec node server.js