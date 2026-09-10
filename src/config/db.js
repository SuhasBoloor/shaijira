const config = require('./env')
const {drizzle} = require('drizzle-orm/node-postgres')

const { Pool } = require('pg');
const pool = new Pool({ connectionString: config.DATABASE_URL });

const db = drizzle(pool)

module.exports = { db, pool };