// apps/auth-service/src/config/redis.ts

import { Redis } from '@upstash/redis';
import { logger } from '@repo/shared';

let redisClient: Redis | null = null;

/**
 * Get Redis Client Instance (Upstash)
 */
export async function getRedisClient(): Promise<Redis> {
  if (redisClient) {
    return redisClient;
  }

  try {
    // Create Upstash Redis client
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_URL || 'https://trusted-jaguar-32717.upstash.io',
      token: process.env.UPSTASH_REDIS_TOKEN || 'AX_NAAIncDI2MTg5NTkwYjEwODI0MjEyYTg0NWJiMzdiNjQxMjk2MHAyMzI3MTc',
    });

    // Test connection
    await redisClient.ping();
    
    logger.info('✅ Redis connected (Upstash)');
    
    return redisClient;
  } catch (error) {
    logger.error('❌ Redis connection failed', error);
    throw error;
  }
}

/**
 * Disconnect Redis (cleanup)
 */
export async function disconnectRedis() {
  if (redisClient) {
    redisClient = null;
    logger.info('Redis disconnected');
  }
}

/**
 * Redis Cache Helper Functions
 */
export class RedisCache {
  /**
   * Set value in Redis with expiry
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds (default: 3600 = 1 hour)
   */
  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const client = await getRedisClient();
    const serialized = JSON.stringify(value);
    await client.set(key, serialized, { ex: ttl });
  }

  /**
   * Get value from Redis
   * @param key - Cache key
   */
  static async get<T = any>(key: string): Promise<T | null> {
    const client = await getRedisClient();
    const data = await client.get(key);
    
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data as string) as T;
    } catch {
      return data as T;
    }
  }

  /**
   * Delete key from Redis
   * @param key - Cache key
   */
  static async delete(key: string): Promise<void> {
    const client = await getRedisClient();
    await client.del(key);
  }

  /**
   * Check if key exists
   * @param key - Cache key
   */
  static async exists(key: string): Promise<boolean> {
    const client = await getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  }

  /**
   * Set expiry on existing key
   * @param key - Cache key
   * @param ttl - Time to live in seconds
   */
  static async expire(key: string, ttl: number): Promise<void> {
    const client = await getRedisClient();
    await client.expire(key, ttl);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  await disconnectRedis();
});

process.on('SIGTERM', async () => {
  await disconnectRedis();
});