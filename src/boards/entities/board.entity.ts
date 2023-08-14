import { BoardColumn } from 'src/board-columns/board-column.entity';
import { BoardMembership } from 'src/boards/board-members/board-membership.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => BoardColumn, (col) => col.board)
  columns: BoardColumn[];

  @OneToMany(() => BoardMembership, (membership) => membership.board)
  members: BoardMembership[];
}
