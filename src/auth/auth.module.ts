import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { RedisStrategy } from './redis.strategy';
import { AuthSerializer } from './serialization.provider';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
  ],
  providers: [AuthService, RedisStrategy, AuthSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
