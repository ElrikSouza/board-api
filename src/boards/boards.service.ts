import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBoardDTO } from './dto/create-board.dto';
import { Board } from './entities/board.entity';
import { partialViewerRole } from './roles/default-role';
import { Role } from './roles/role.entity';
import { mapRoleDtoToCreateRoleBO } from './roles/role.mapper';

type GetOneBoardParams = {
  boardId: string;
  loadMemberships?: boolean;
  loadCards?: boolean;
};

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private readonly boardRepo: Repository<Board>,
    private readonly dataSource: DataSource,
  ) {}

  private mightHaveFoundBoard(board?: Board) {
    if (!board) {
      throw new NotFoundException('The desired board was not found');
    }

    return board;
  }

  async createBoard(userId: string, boardDTO: CreateBoardDTO) {
    const result = await this.dataSource.transaction(async (entityManager) => {
      const newBoard = this.boardRepo.create({ ...boardDTO, userId });
      const board = await entityManager.save<Board>(newBoard);
      const role = mapRoleDtoToCreateRoleBO(partialViewerRole, board.id);
      const newRole = entityManager.create<Role>(Role, role);
      entityManager.save<Role>(newRole);

      return board;
    });

    return result;
  }

  async getUserBoards(userId: string) {
    return this.dataSource
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoin(
        'board_membership',
        'membership',
        'membership.boardId = board.id',
      )
      .where(':userId in (membership.userId, board.userId)', {
        userId,
      })
      .getMany();
  }

  async getOneBoard({
    boardId,
    loadMemberships = false,
    loadCards = false,
  }: GetOneBoardParams) {
    const result = await this.boardRepo.findOne({
      where: { id: boardId },
      relations: {
        members: loadMemberships,
        columns: loadCards && { cards: true },
      },
    });

    return result;
  }

  async getBoardOwnerId(boardId: string) {
    const result = await this.boardRepo.findOne({
      select: ['userId'],
      where: { id: boardId },
    });

    this.mightHaveFoundBoard(result);

    return result.userId;
  }

  async deleteOneBoard(boardId: string) {
    await this.boardRepo.delete(boardId);
  }

  async updateBoard(boardId: string, boardDTO: CreateBoardDTO) {
    return this.boardRepo.update(boardId, boardDTO);
  }
}
