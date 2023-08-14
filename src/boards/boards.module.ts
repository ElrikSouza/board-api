import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { BoardColumn } from './board-columns/board-column.entity';
import { BoardColumnsController } from './board-columns/board-columns.controller';
import { BoardColumnsService } from './board-columns/board-columns.service';
import { BoardMembersController } from './board-members/board-members.controller';
import { BoardMembersService } from './board-members/board-members.service';
import { BoardMembership } from './board-members/board-membership.entity';
import { BoardPolicy } from './board.policy';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Card } from './cards/card.entity';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';
import { Board } from './entities/board.entity';
import { InvitationPolicy } from './invitations/InvitationPolicy';
import { Invitation } from './invitations/invitation.entity';
import { InvitationsController } from './invitations/invitations.controller';
import { InvitationsService } from './invitations/invitations.service';
import { Role } from './roles/role.entity';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';

@Module({
  controllers: [
    BoardsController,
    BoardMembersController,
    InvitationsController,
    RolesController,
    BoardColumnsController,
    CardsController,
  ],
  providers: [
    BoardsService,
    BoardMembersService,
    InvitationsService,
    RolesService,
    BoardPolicy,
    BoardColumnsService,
    CardsService,
    InvitationPolicy,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Board,
      BoardMembership,
      Invitation,
      Role,
      BoardColumn,
      Card,
    ]),
    UsersModule,
  ],
  exports: [BoardsService],
})
export class BoardsModule {}
