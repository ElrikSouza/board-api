import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumnsService } from 'src/board-columns/board-columns.service';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDTO } from './dto/create-card.dto';
import { UpdateCardDTO } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private readonly cardRepo: Repository<Card>,
    private readonly boardColumnsService: BoardColumnsService,
  ) {}

  private async getOneCard(userId: string, cardId: string) {
    const card = await this.cardRepo.findOneBy({ userId, id: cardId });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async createOne(userId: string, colId: string, cardDTO: CreateCardDTO) {
    const column = await this.boardColumnsService.getOneBoardColumn(
      userId,
      colId,
    );
    const newCard = this.cardRepo.create({ ...cardDTO, column, userId });

    return this.cardRepo.save(newCard);
  }

  async deleteOne(userId: string, cardId: string) {
    await this.getOneCard(userId, cardId);
    await this.cardRepo.delete(cardId);
  }

  async updateOne(userId: string, cardId: string, cardDTO: UpdateCardDTO) {
    const card = await this.getOneCard(userId, cardId);
    await this.cardRepo.update(card.id, cardDTO);
    return this.getOneCard(userId, cardId);
  }
}
