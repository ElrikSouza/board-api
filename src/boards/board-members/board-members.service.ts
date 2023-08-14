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

  getMembership(userId: string, boardId: string) {
    const membership = this.boardMembersRepo.findOneBy({ userId, boardId });
    if (!membership) {
      throw new ForbiddenException('no membership');
    }
    return membership;
  }
}
