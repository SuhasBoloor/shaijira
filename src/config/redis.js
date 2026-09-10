    const {createClient} =require('redis')
    const config = require('./env')

    const client = createClient({url: config.REDIS_URL})

    client.on('error', (err) => console.error('Redis Client Error', err));
    client.connect().catch((err) => console.error('Redis Connection Error:', err));

    module.exports = {client}