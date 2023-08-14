import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity()
export class BoardMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  boardId: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Board, (board) => board.members)
  board: Board;

  @ManyToOne(() => Role)
  role: Role;
}
