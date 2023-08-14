import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMembersController } from './board-members/board-members.controller';
import { BoardMembersService } from './board-members/board-members.service';
import { BoardMembership } from './board-members/board-membership.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { Invitation } from './invitations/invitation.entity';
import { InvitationsController } from './invitations/invitations.controller';
import { InvitationsService } from './invitations/invitations.service';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';

@Module({
  controllers: [
    BoardsController,
    BoardMembersController,
    InvitationsController,
    RolesController,
  ],
  providers: [
    BoardsService,
    BoardMembersService,
    InvitationsService,
    RolesService,
  ],
  imports: [TypeOrmModule.forFeature([Board, BoardMembership, Invitation])],
  exports: [BoardsService],
})
export class BoardsModule {}
