import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDTO } from './dto/create-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private readonly boardRepo: Repository<Board>,
  ) {}

  private mightHaveFoundBoard(board?: Board) {
    if (!board) {
      throw new NotFoundException('The desired board was not found');
    }

    return board;
  }

  createBoard(userId: string, boardDTO: CreateBoardDTO) {
    const newBoard = this.boardRepo.create({ ...boardDTO, userId });
    return this.boardRepo.save(newBoard);
  }

  getUserBoards(userId: string) {
    return this.boardRepo.findBy({ userId });
  }

  async getOneBoard(userId: string, boardId: string) {
    const board = await this.boardRepo.findOneBy({ userId, id: boardId });
    return this.mightHaveFoundBoard(board);
  }

  async deleteOneBoard(userId: string, boardId: string) {
    const board = await this.getOneBoard(userId, boardId);
    await this.boardRepo.delete(board);
  }

  async updateBoard(userId: string, boardId: string, boardDTO: CreateBoardDTO) {
    const actualBoard = await this.getOneBoard(userId, boardId);
    return this.boardRepo.update(actualBoard, boardDTO);
  }
}