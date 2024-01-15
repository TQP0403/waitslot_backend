import { env } from "@configs/environment-variable";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RedisClientType, createClient } from "redis";

@Injectable()
export class CacheService implements OnModuleInit {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
      username: env.redis.username,
      password: env.redis.password, // use your password here
      socket: {
        host: env.redis.host,
        port: env.redis.port,
        tls: env.redis.tls,
      },
    });
  }

  async onModuleInit(): Promise<void> {
    this.client.on("ready", () => {
      this.logger.debug("Redis cache successfully connected");
    });

    this.client.on("error", (err) => {
      this.logger.error("Redis cache failed", err);
    });

    await this.client.connect();
  }

  async get(key: string): Promise<string> {
    const value = await this.client.get(key);

    return value;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const storeData: string =
      typeof value === "object" ? JSON.stringify(value) : value.toString();

    await this.client.set(key, storeData, { EX: ttl });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
