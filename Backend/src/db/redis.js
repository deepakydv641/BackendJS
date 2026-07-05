import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17096.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17096,
        keepAlive: 10000,           // send keepalive every 10s to prevent idle disconnect
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.log('error in redis reconnectStrategy: max reconnect attempts reached');
                return new Error('Max reconnect attempts reached');
            }
            const delay = Math.min(retries * 200, 3000); // backoff: 200ms → 3s
            return delay;
        }
    }
});

client.on('error', err => console.log('error in redis client:', err.message));

await client.connect();

// Export helper functions with connection checking
export const redisSet = async (key, value, options) => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        return await client.set(key, value, options);
    } catch (error) {
        console.log('error in redisSet:', error.message);
        throw new Error(`Redis operation failed: ${error.message}`);
    }
};

export const redisGet = async (key) => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        return await client.get(key);
    } catch (error) {
        console.log('error in redisGet:', error.message);
        throw new Error(`Redis operation failed: ${error.message}`);
    }
};

export const redisDel = async (key) => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        return await client.del(key);
    } catch (error) {
        console.log('error in redisDel:', error.message);
        throw new Error(`Redis operation failed: ${error.message}`);
    }
};

export default client;
export { client as redisClient };
