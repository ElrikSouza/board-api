import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { BoardColumn } from '../board-columns/board-column.entity';
import { BoardMembership } from '../board-members/board-membership.entity';

export class BoardFullDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  user: User;

  @ApiProperty({ type: BoardMembership, isArray: true })
  members: BoardMembership[];

  @ApiProperty({ type: BoardColumn, isArray: true })
  columns: BoardColumn[];
}
