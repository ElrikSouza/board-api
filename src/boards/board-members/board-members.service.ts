import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BoardMembership } from './board-membership.entity';

@Injectable()
export class BoardMembersService {
  constructor(
    @InjectRepository(BoardMembership)
    private readonly boardMembersRepo: Repository<BoardMembership>,
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
    userId: string,
    boardId: string,
    roleId: string,
    transaction?: EntityManager,
  ) {
    if (!transaction) {
      this.boardMembersRepo.manager.transaction((t) => {
        return this.createBoardMembership(userId, boardId, roleId, t);
      });
    }

    const toInsert = transaction.create(BoardMembership, {
      boardId,
      roleId,
      userId,
    });

    const newMembership = transaction.save(toInsert);

    return newMembership;
  }
}
