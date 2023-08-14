import { Card } from 'src/boards/cards/card.entity';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Board, (board) => board.columns)
  board: Board;

  @Column()
  boardId: string;

  @OneToMany(() => Card, (card) => card.column, {
    cascade: true,
    eager: true,
  })
  cards: Card[];

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;
}
