import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Invitation } from '../invitations/invitation.entity';
import { BoardMembership } from './board-membership.entity';

@Injectable()
export class BoardMembersService {
  constructor(
    @InjectRepository(BoardMembership)
    private readonly boardMembersRepo: Repository<BoardMembership>,
    private readonly dataSource: DataSource,
  ) {}

  async getMembership(userId: string, boardId: string) {
    const membership = await this.boardMembersRepo.findOne({
      where: {
        userId,
        boardId,
      },
      relations: {
        role: true,
      },
    });
    if (!membership) {
      throw new ForbiddenException('no membership');
    }
    return membership;
  }

  async createBoardMembership(
    invitationId: string,
    userId: string,
    boardId: string,
    roleId: string,
  ) {
    const result = await this.dataSource.transaction((transactionManager) => {
      const toInsert = transactionManager.create(BoardMembership, {
        boardId,
        roleId,
        userId,
      });

      const newMembership = transactionManager.save(toInsert);

      transactionManager.delete(Invitation, { id: invitationId });

      return newMembership;
    });

    return result;
  }
}
