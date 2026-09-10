const config = require('./env')
const {drizzle} = require('drizzle-orm/node-postgres')
const { Pool } = require('pg');

const isLocal = !config.DATABASE_URL || 
                config.DATABASE_URL.includes('localhost') || 
                config.DATABASE_URL.includes('127.0.0.1') || 
                config.DATABASE_URL.includes('postgres:5432');

const pool = new Pool({ 
    connectionString: config.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

const db = drizzle(pool)

module.exports = { db, pool };