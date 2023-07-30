import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: any) {
    done(null, { id: user.id, email: user.email, fullName: user.fullName });
  }

  async deserializeUser(payload: any, done: any) {
    const user = await this.authService.findById(payload.id);
    done(null, user);
  }
}
