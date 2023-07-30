import { ForbiddenException, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dtos/login.dto';
import { SignUpDTO } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(loginDTO: LoginDTO) {
    const user = await this.usersService.findByEmail(loginDTO.email);

    if (!user) {
      throw new ForbiddenException();
    }

    const doPasswordsMatch = await compare(loginDTO.password, user.password);

    if (!doPasswordsMatch) {
      throw new ForbiddenException();
    }

    return user;
  }

  async signUp(signUpDTO: SignUpDTO) {
    const newPass = await hash(signUpDTO.password, 12);

    await this.usersService.createUser({ ...signUpDTO, password: newPass });
  }

  async findById(id: string) {
    return this.usersService.findById(id);
  }
}
