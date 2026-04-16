// Test Redis connection with new database
import { redisSet, redisGet } from './src/db/redis.js';

async function testRedis() {
    console.log('🔴 Testing Redis with new database...');
    console.log('Host: redis-17096.crce263.ap-south-1-1.ec2.cloud.redislabs.com:17096');
    
    try {
        // Test setting a value (like your example)
        await redisSet('foo', 'bar');
        console.log('✅ Set "foo" to "bar" successfully');

        // Test getting the value
        const result = await redisGet('foo');
        console.log('✅ Got value:', result); // Should print "bar"

        if (result === 'bar') {
            console.log('✅ Redis is working perfectly! Forgot password should work now.');
        } else {
            console.log('❌ Value mismatch - expected "bar", got:', result);
        }
    } catch (error) {
        console.log('❌ Redis test failed:', error.message);
        console.log('Make sure your .env file has the correct REDIS_PASSWORD');
    }
}

testRedis();
