import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }

  findById(id: string) {
    return this.usersRepo.findOneBy({ id });
  }

  async createUser(userDto: SignUpDTO) {
    const user = this.usersRepo.create(userDto);
    await this.usersRepo.save(user);
  }
}
