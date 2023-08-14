import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDTO } from './dto/create-card.dto';
import { UpdateCardDTO } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private readonly cardRepo: Repository<Card>,
  ) {}

  async getBoardIdAndOwnerId(cardId: string) {
    const card = await this.cardRepo.findOne({
      where: { id: cardId },
      relations: { board: true },
      select: ['board'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return {
      boardId: card.board.id,
      ownerId: card.board.userId,
    };
  }

  private async getOneCard(cardId: string) {
    const card = await this.cardRepo.findOneBy({ id: cardId });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async createOne(
    userId: string,
    boardId: string,
    colId: string,
    cardDTO: CreateCardDTO,
  ) {
    const newCard = this.cardRepo.create({
      ...cardDTO,
      columnId: colId,
      boardId,
      userId,
    });

    return this.cardRepo.save(newCard);
  }

  async deleteOne(cardId: string) {
    await this.cardRepo.delete(cardId);
  }

  async updateOne(cardId: string, cardDTO: UpdateCardDTO) {
    await this.cardRepo.update(cardId, cardDTO);
    return this.getOneCard(cardId);
  }
}
