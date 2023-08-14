import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardColumn } from './board-column.entity';
import { CreateBoardColumnDTO } from './dto/create-board-col.dto';

@Injectable()
export class BoardColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly boardColRepo: Repository<BoardColumn>,
  ) {}

  async getBoardOwnerAndBoardIdOfColumn(colId: string) {
    const col = await this.boardColRepo.findOne({
      where: { id: colId },
      select: ['board'],
    });

    if (!col) {
      throw new NotFoundException('');
    }
    const { userId, id } = col.board;
    return {
      boardId: id,
      ownerId: userId,
    };
  }

  async getOneBoardColumn(colId: string, cards = false) {
    const boardCol = this.boardColRepo.findOne({
      where: { id: colId },
      relations: { cards },
    });

    if (!boardCol) {
      throw new NotFoundException('No such column found');
    }

    return boardCol;
  }

  async deleteOneColumn(colId: string) {
    await this.boardColRepo.delete(colId);
  }

  async createOneColumn(boardId: string, boardColDTO: CreateBoardColumnDTO) {
    const newBoardCol = this.boardColRepo.create({
      ...boardColDTO,
      boardId,
    });

    return await this.boardColRepo.save(newBoardCol);
  }

  async updateOneColumn(colId: string, boardColDTO: CreateBoardColumnDTO) {
    await this.boardColRepo.update(colId, boardColDTO);
    return this.getOneBoardColumn(colId);
  }
}
