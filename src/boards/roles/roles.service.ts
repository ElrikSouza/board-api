import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateRoleBO } from './create-role.bo';
import { partialViewerRole } from './default-role';
import { Role } from './role.entity';
import { mapRoleDtoToCreateRoleBO } from './role.mapper';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  createRole(createRole: CreateRoleBO) {
    const role = this.roleRepo.create(createRole);
    return this.roleRepo.save(role);
  }

  createViewerRoleOnBoard(boardId: string, transaction?: EntityManager) {
    if (!transaction) {
      return this.roleRepo.manager.transaction((t) => {
        return this.createViewerRoleOnBoard(boardId, t);
      });
    }

    const viewerRole = mapRoleDtoToCreateRoleBO(partialViewerRole, boardId);
    transaction.save(Role, viewerRole);
  }

  getBoardRoles(boardId: string) {
    return this.roleRepo.findBy({ boardId });
  }
}
