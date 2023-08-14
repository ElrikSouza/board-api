import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { AuthPolicyFn } from 'src/auth/policy.pipe';
import { BoardPolicy, COLUMN_ACTIONS, SUBJECT } from '../board.policy';
import { BoardColumnsService } from './board-columns.service';
import { CreateBoardColumnDTO } from './dto/create-board-col.dto';

@UseGuards(LoggedInGuard)
@Controller()
export class BoardColumnsController {
  constructor(private readonly boardColumnsService: BoardColumnsService) {}

  @Delete('board-columns/:id')
  async deleteOne(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
  ) {
    const { boardId, ownerId } =
      await this.boardColumnsService.getBoardOwnerAndBoardIdOfColumn(id);

    await authorize({
      action: COLUMN_ACTIONS.DELETE,
      subjectTag: SUBJECT.COLUMN,
      ownerId,
      boardId,
    });

    return this.boardColumnsService.deleteOneColumn(id);
  }

  @Post('boards/:boardId/board-columns')
  async createOne(
    @Param('boardId') boardId: string,
    @Body() boardCol: CreateBoardColumnDTO,
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
  ) {
    await authorize({
      action: COLUMN_ACTIONS.CREATE,
      subjectTag: SUBJECT.COLUMN,
      boardId,
    });

    return this.boardColumnsService.createOneColumn(boardId, boardCol);
  }

  @Patch('board-columns/:id')
  async patchOne(
    @Param('id') colId: string,
    @Body() updateDTO: CreateBoardColumnDTO,
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
  ) {
    const { boardId, ownerId } =
      await this.boardColumnsService.getBoardOwnerAndBoardIdOfColumn(colId);

    await authorize({
      action: COLUMN_ACTIONS.EDIT,
      subjectTag: SUBJECT.COLUMN,
      ownerId,
      boardId,
    });

    return this.boardColumnsService.updateOneColumn(colId, updateDTO);
  }
}
