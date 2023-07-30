import { Module } from '@nestjs/common';
import * as Redis from 'redis';
import { REDIS_CLIENT } from './client.const';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {
        const c = Redis.createClient({
          socket: {
            port: +process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
          },
        });

        await c.connect();
        return c;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
