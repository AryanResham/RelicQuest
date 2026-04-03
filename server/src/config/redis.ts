import Redis from "ioredis";

const redisURL = process.env.REDIS_URL;
const client = new Redis(redisURL!);

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err: Error) => {
    console.log('Redis client error', err);
});

export default client;