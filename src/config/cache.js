const { promisify } = require('util');
const redis = require('redis');

const client = redis.createClient('redis://172.81.181.172:6379');

const redisGet = promisify(client.get).bind(client);
const redisSet = promisify(client.set).bind(client);

module.exports = { redisGet, redisSet };
