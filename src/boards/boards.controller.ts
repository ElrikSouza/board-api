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
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { AuthPolicyFn } from 'src/auth/policy.pipe';
import { GetUser } from 'src/common/user.decorator';
import { User } from 'src/users/user.entity';
import { BOARD_ACTIONS, BoardPolicy, SUBJECT } from './board.policy';
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
  async findOne(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
  ) {
    const board = await this.boardsService.getOneBoard({
      boardId: id,
      loadCards: true,
      loadMemberships: true,
    });

    await authorize({
      action: BOARD_ACTIONS.READ,
      subjectTag: SUBJECT.BOARD,
      boardId: id,
      ownerId: board.userId,
    });

    return board;
  }

  @Delete(':id')
  async deleteOne(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
  ) {
    await authorize({
      action: BOARD_ACTIONS.DELETE,
      subjectTag: SUBJECT.BOARD,
      boardId: id,
    });

    await this.boardsService.deleteOneBoard(id);
  }

  @Patch(':id')
  async patchOne(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
    @Body() boardDTO: CreateBoardDTO,
  ) {
    await authorize({
      action: BOARD_ACTIONS.EDIT,
      subjectTag: SUBJECT.BOARD,
      boardId: id,
    });

    return this.boardsService.updateBoard(id, boardDTO);
  }

  @Post()
  async create(@GetUser() user: User, @Body() boardDTO: CreateBoardDTO) {
    const board = await this.boardsService.createBoard(user.id, boardDTO);
    return board;
  }
}
