import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { In, Repository } from 'typeorm';
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

  async getUserIdEmailMapByEmail(
    emails: string[],
  ): Promise<Record<string, string>> {
    const emailAndId = await this.usersRepo.find({
      where: { email: In(emails) },
      select: ['email', 'id'],
    });

    return emailAndId.reduce(
      (prev, next) => ({ ...prev, [next.email]: next.id }),
      {},
    );
  }
}
