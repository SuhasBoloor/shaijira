#!/bin/bash
set -e

echo "Starting Redis..."
service redis-server start

echo "Starting PostgreSQL..."
service postgresql start

echo "Configuring PostgreSQL database..."
su - postgres -c "psql -c \"CREATE USER postgres WITH PASSWORD 'postgres';\"" || true
su - postgres -c "psql -c \"ALTER USER postgres WITH SUPERUSER;\"" || true
su - postgres -c "psql -c \"CREATE DATABASE rbac_app OWNER postgres;\"" || true

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

echo "Syncing database schema..."
npx drizzle-kit push --force || true

echo "Seeding baseline permissions..."
node src/seed.js || true

echo "Launching Shai-Jira on port $PORT..."
exec node server.js