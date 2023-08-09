import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { RedisClientType } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BoardColumnsModule } from './board-columns/board-columns.module';
import { BoardsModule } from './boards/boards.module';
import { CardsModule } from './cards/cards.module';
import { REDIS_CLIENT } from './redis/client.const';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +process.env.PORT,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      username: process.env.DB_USER,
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    BoardsModule,
    AuthModule,
    UsersModule,
    RedisModule,
    BoardColumnsModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new RedisStore({ client: this.redis }),
          saveUninitialized: false,
          secret: 'sup3rs3cr3t',
          resave: false,
          cookie: {
            sameSite: false,
            httpOnly: false,
            maxAge: 600000000,
            secure: false,
            path: '/',
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
