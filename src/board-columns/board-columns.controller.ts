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
@Controller('boards/:boardId/board-columns')
export class BoardColumnsController {
  constructor(private readonly boardColumnsService: BoardColumnsService) {}

  @Delete(':id')
  deleteOne(@GetUser() user: User, @Param('id') id: string) {
    return this.boardColumnsService.deleteOneColumn(user.id, id);
  }

  @Post()
  createOne(
    @GetUser() user: User,
    @Param('boardId') boardId: string,
    @Body() boardCol: CreateBoardColumnDTO,
  ) {
    return this.boardColumnsService.createOneColumn(user.id, boardId, boardCol);
  }

  @Patch()
  patchOne(
    @GetUser() user: User,
    @Param('id') colId: string,
    @Body() updateDTO: CreateBoardColumnDTO,
  ) {
    return this.boardColumnsService.updateOneColumn(user.id, colId, updateDTO);
  }
}
