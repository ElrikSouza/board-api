import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { GetUser } from 'src/common/user.decorator';
import { User } from 'src/users/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDTO } from './dto/create-board.dto';

@UseGuards(LoggedInGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.boardsService.getUserBoards(user.id);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.boardsService.getOneBoard(user.id, id);
  }

  @Delete(':id')
  async deleteOne(@GetUser() user: User, @Param('id') id: string) {
    await this.boardsService.deleteOneBoard(user.id, id);
  }

  @Patch(':id')
  patchOne(
    @GetUser() user: User,
    @Param('id') id: string,
    boardDTO: CreateBoardDTO,
  ) {
    return this.boardsService.updateBoard(user.id, id, boardDTO);
  }

  @Post()
  async create(@GetUser() user: User, @Body() boardDTO: CreateBoardDTO) {
    const board = await this.boardsService.createBoard(user.id, boardDTO);
    return board;
  }
}
