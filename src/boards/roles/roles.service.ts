import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleBO } from './create-role.bo';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  createRole(createRole: CreateRoleBO) {
    const role = this.roleRepo.create(createRole);
    return this.roleRepo.save(role);
  }

  getBoardRoles(boardId: string) {
    return this.roleRepo.findBy({ boardId });
  }
}
