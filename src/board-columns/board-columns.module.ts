import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from 'src/boards/boards.module';
import { BoardColumn } from './board-column.entity';
import { BoardColumnsController } from './board-columns.controller';
import { BoardColumnsService } from './board-columns.service';

@Module({
  controllers: [BoardColumnsController],
  providers: [BoardColumnsService],
  imports: [TypeOrmModule.forFeature([BoardColumn]), BoardsModule],
  exports: [BoardColumnsService],
})
export class BoardColumnsModule {}
