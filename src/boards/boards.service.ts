import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBoardDTO } from './dto/create-board.dto';
import { Board } from './entities/board.entity';
import { RolesService } from './roles/roles.service';

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
    private readonly roleService: RolesService,
  ) {}

  private mightHaveFoundBoard(board?: Board) {
    if (!board) {
      throw new NotFoundException('The desired board was not found');
    }

    return board;
  }

  async createBoard(board: Board) {
    const result = this.boardRepo.manager.transaction(async (transaction) => {
      const newBoard = await transaction.save(board);
      await this.roleService.createViewerRoleOnBoard(newBoard.id, transaction);

      return newBoard;
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
    await this.boardRepo.update(boardId, boardDTO);
    return this.getOneBoard({ boardId });
  }
}
