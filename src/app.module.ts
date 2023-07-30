import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +process.env.PORT,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      username: process.env.DB_USER,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
