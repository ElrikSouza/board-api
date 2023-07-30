import { MiddlewareConsumer } from '@nestjs/common';
import { RedisClientType } from 'redis';
export declare class AppModule {
    private readonly redis;
    constructor(redis: RedisClientType);
    configure(consumer: MiddlewareConsumer): void;
}
