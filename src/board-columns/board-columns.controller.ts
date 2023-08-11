import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { GetUser } from 'src/common/user.decorator';
import { User } from 'src/users/user.entity';
import { BoardColumnsService } from './board-columns.service';
import { CreateBoardColumnDTO } from './dto/create-board-col.dto';

@UseGuards(LoggedInGuard)
@Controller()
export class BoardColumnsController {
  constructor(private readonly boardColumnsService: BoardColumnsService) {}

  @Delete('board-columns/:id')
  deleteOne(@GetUser() user: User, @Param('id') id: string) {
    return this.boardColumnsService.deleteOneColumn(user.id, id);
  }

  @Post('boards/:boardId/board-columns')
  createOne(
    @GetUser() user: User,
    @Param('boardId') boardId: string,
    @Body() boardCol: CreateBoardColumnDTO,
  ) {
    return this.boardColumnsService.createOneColumn(user.id, boardId, boardCol);
  }

  @Patch('board-columns/:id')
  patchOne(
    @GetUser() user: User,
    @Param('id') colId: string,
    @Body() updateDTO: CreateBoardColumnDTO,
  ) {
    return this.boardColumnsService.updateOneColumn(user.id, colId, updateDTO);
  }
}
