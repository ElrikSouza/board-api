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
import { GetUser } from 'src/common/user.decorator';
import { User } from 'src/users/user.entity';
import { BoardColumnsService } from '../board-columns/board-columns.service';
import { BoardPolicy, CARD_ACTIONS, SUBJECT } from '../board.policy';
import { CardsService } from './cards.service';
import { CreateCardDTO } from './dto/create-card.dto';
import { UpdateCardDTO } from './dto/update-card.dto';

@UseGuards(LoggedInGuard)
@Controller()
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly columnService: BoardColumnsService,
  ) {}

  @Post('/board-columns/:colId/cards')
  async createOneCard(
    @GetUser() user: User,
    @Param('colId') colId: string,
    @Body() cardDTO: CreateCardDTO,
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
  ) {
    const { boardId, ownerId } =
      await this.columnService.getBoardOwnerAndBoardIdOfColumn(colId);

    await authorize({
      action: CARD_ACTIONS.CREATE,
      subjectTag: SUBJECT.CARD,
      boardId,
      ownerId,
    });

    return this.cardsService.createOne(user.id, boardId, colId, cardDTO);
  }

  @Delete('/cards/:id')
  async deleteOneCard(
    @Param('id') id: string,
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
  ) {
    const { boardId, ownerId } = await this.cardsService.getBoardIdAndOwnerId(
      id,
    );

    await authorize({
      action: CARD_ACTIONS.DELETE,
      subjectTag: SUBJECT.CARD,
      boardId,
      ownerId,
    });

    await this.cardsService.deleteOne(id);
  }

  @Patch('/cards/:id')
  async editOneCard(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
    @Body() editDTO: UpdateCardDTO,
  ) {
    const { boardId, ownerId } = await this.cardsService.getBoardIdAndOwnerId(
      id,
    );

    await authorize({
      action: CARD_ACTIONS.EDIT,
      subjectTag: SUBJECT.CARD,
      boardId,
      ownerId,
    });

    return this.cardsService.updateOne(id, editDTO);
  }
}
