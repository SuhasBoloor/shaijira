const config = require('./src/config/env')

module.exports = {
  schema: './src/models/schema/index.js',   // where your table definitions live
  out: './drizzle/migrations',          // where generated migration SQL files go
  dialect: 'postgresql',                // which database
  dbCredentials: {
    url: config.DATABASE_URL,      // connection string
    ssl: false,
  },
};