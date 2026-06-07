// import { createClient } from 'redis';
// import dotenv from 'dotenv';

// dotenv.config();

// const client = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: 'redis-17096.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 17096,
//         keepAlive: 10000,           // send keepalive every 10s to prevent idle disconnect
//         reconnectStrategy: (retries) => {
//             if (retries > 10) {
//                 console.error('Redis: max reconnect attempts reached');
//                 return new Error('Max reconnect attempts reached');
//             }
//             const delay = Math.min(retries * 200, 3000); // backoff: 200ms → 3s
//             console.log(`Redis: reconnecting in ${delay}ms (attempt ${retries})`);
//             return delay;
//         }
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));
// client.on('reconnecting', () => console.log('Redis: reconnecting...'));
// client.on('ready', () => console.log('Redis: connected '));
// client.on('end', () => console.log('Redis: connection ended'));

// await client.connect();

// // Export helper functions with connection checking
// export const redisSet = async (key, value, options) => {
//     try {
//         if (!client.isOpen) {
//             console.log('Redis client is closed, attempting to reconnect...');
//             await client.connect();
//         }
//         return await client.set(key, value, options);
//     } catch (error) {
//         console.error('Redis SET error:', error.message);
//         throw new Error(`Redis operation failed: ${error.message}`);
//     }
// };

// export const redisGet = async (key) => {
//     try {
//         if (!client.isOpen) {
//             console.log('Redis client is closed, attempting to reconnect...');
//             await client.connect();
//         }
//         return await client.get(key);
//     } catch (error) {
//         console.error('Redis GET error:', error.message);
//         throw new Error(`Redis operation failed: ${error.message}`);
//     }
// };

// export const redisDel = async (key) => {
//     try {
//         if (!client.isOpen) {
//             console.log('Redis client is closed, attempting to reconnect...');
//             await client.connect();
//         }
//         return await client.del(key);
//     } catch (error) {
//         console.error('Redis DEL error:', error.message);
//         throw new Error(`Redis operation failed: ${error.message}`);
//     }
// };

// export default client;

import Redis from "ioredis";

const redis=new Redis(process.env.REDIS_URL);
redis.on("connect", () => {
    console.log("Redis: connected");
});
redis.on("error", (err) => {
    console.log("Redis: error", err);
});

export const redisClient = redis;