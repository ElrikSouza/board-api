import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  invitedUser: User;

  @Column()
  invitedUserId: string;

  @ManyToOne(() => User)
  senderUser: User;

  @Column()
  senderUserId: string;

  @ManyToOne(() => Board)
  board: Board;

  @Column()
  boardId: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ nullable: true })
  roleId?: string;
}
