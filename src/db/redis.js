import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-11939.crce292.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 11939,
        keepAlive: 10000,           // send keepalive every 10s to prevent idle disconnect
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis: max reconnect attempts reached');
                return new Error('Max reconnect attempts reached');
            }
            const delay = Math.min(retries * 200, 3000); // backoff: 200ms → 3s
            console.log(`Redis: reconnecting in ${delay}ms (attempt ${retries})`);
            return delay;
        }
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('reconnecting', () => console.log('Redis: reconnecting...'));
client.on('ready', () => console.log('Redis: connected ✅'));

await client.connect();

export default client;