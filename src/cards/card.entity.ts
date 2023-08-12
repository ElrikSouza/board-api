import { BoardColumn } from 'src/board-columns/board-column.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => BoardColumn, (column) => column.cards, {
    onDelete: 'CASCADE',
  })
  column: BoardColumn;

  @Column()
  columnId: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;
}
