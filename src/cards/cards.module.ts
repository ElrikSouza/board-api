import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumnsModule } from 'src/board-columns/board-columns.module';
import { Card } from './card.entity';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

@Module({
  providers: [CardsService],
  controllers: [CardsController],
  imports: [TypeOrmModule.forFeature([Card]), BoardColumnsModule],
})
export class CardsModule {}
