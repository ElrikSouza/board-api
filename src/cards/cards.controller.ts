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
import { CardsService } from './cards.service';
import { CreateCardDTO } from './dto/create-card.dto';
import { UpdateCardDTO } from './dto/update-card.dto';

@UseGuards(LoggedInGuard)
@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('/board-columns/:colId/cards')
  createOneCard(
    @GetUser() user: User,
    @Param('colId') colId: string,
    @Body() cardDTO: CreateCardDTO,
  ) {
    return this.cardsService.createOne(user.id, colId, cardDTO);
  }

  @Delete('/cards/:id')
  async deleteOneCard(@GetUser() user: User, @Param('id') id: string) {
    await this.cardsService.deleteOne(user.id, id);
  }

  @Patch('/cards/:id')
  async editOneCard(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() editDTO: UpdateCardDTO,
  ) {
    return this.cardsService.updateOne(user.id, id, editDTO);
  }
}
