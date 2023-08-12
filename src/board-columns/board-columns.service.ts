import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsService } from 'src/boards/boards.service';
import { Repository } from 'typeorm';
import { BoardColumn } from './board-column.entity';
import { CreateBoardColumnDTO } from './dto/create-board-col.dto';

@Injectable()
export class BoardColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly boardColRepo: Repository<BoardColumn>,
    private readonly boardsService: BoardsService,
  ) {}

  async getOneBoardColumn(userId: string, colId: string, cards = false) {
    const boardCol = this.boardColRepo.findOne({
      where: { id: colId, userId },
      relations: { cards },
    });

    if (!boardCol) {
      throw new NotFoundException('No such column found');
    }

    return boardCol;
  }

  async deleteOneColumn(userId: string, colId: string) {
    const boardCol = await this.getOneBoardColumn(userId, colId);
    await this.boardColRepo.delete(boardCol.id);
  }

  async createOneColumn(
    userId: string,
    boardId: string,
    boardColDTO: CreateBoardColumnDTO,
  ) {
    await this.boardsService.getOneBoard(userId, boardId);

    const newBoardCol = this.boardColRepo.create({
      ...boardColDTO,
      userId,
      boardId,
    });

    return await this.boardColRepo.save(newBoardCol);
  }

  async updateOneColumn(
    userId: string,
    colId: string,
    boardColDTO: CreateBoardColumnDTO,
  ) {
    const originalCol = await this.getOneBoardColumn(userId, colId);
    await this.boardColRepo.update(originalCol.id, boardColDTO);
    return this.getOneBoardColumn(userId, colId);
  }
}
