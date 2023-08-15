import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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

  async createBoardMembership(userId: string, boardId: string, roleId: string) {
    const membership = this.boardMembersRepo.create({
      boardId,
      roleId,
      userId,
    });

    const result = await this.boardMembersRepo.save(membership);

    return result;
  }
}
