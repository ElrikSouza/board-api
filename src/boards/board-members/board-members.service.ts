import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  createBoardMembership(userId: string, boardId: string, roleId: string) {
    const membership = this.boardMembersRepo.create({
      boardId,
      roleId,
      userId,
    });

    return this.boardMembersRepo.save(membership);
  }
}
