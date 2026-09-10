require('dotenv').config();

const requiredVars = ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"];
const config = {};

for (const item of requiredVars) {
  if (!process.env[item]) throw new Error(`${item} is required in the env`);
  config[item] = process.env[item];
}

config.PORT = Number(process.env.PORT) || 3000;

module.exports = config;