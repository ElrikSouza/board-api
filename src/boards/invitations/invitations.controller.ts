import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { AuthPolicyFn } from 'src/auth/policy.pipe';
import { GetUser } from 'src/common/user.decorator';
import { User } from 'src/users/user.entity';
import { BoardMembersService } from '../board-members/board-members.service';
import { BOARD_ACTIONS, BoardPolicy, SUBJECT } from '../board.policy';
import { INVITATION_ACTIONS, InvitationPolicy } from './InvitationPolicy';
import { CreateBulkInvitationsDTO, InvitationDTO } from './invitation.dto';
import { InvitationsService } from './invitations.service';

@UseGuards(LoggedInGuard)
@Controller('')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly boardMembersService: BoardMembersService,
  ) {}

  @Get('/invitations')
  async getInvitations(@GetUser() user: User) {
    return this.invitationsService.getInvitationsByUserId(user.id);
  }

  @Post('/boards/:boardId/invitations')
  async inviteUser(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('boardId') boardId: string,
    @Body() invitationDTO: InvitationDTO,
    @GetUser() user: User,
  ) {
    await authorize({
      action: BOARD_ACTIONS.INVITE,
      subjectTag: SUBJECT.BOARD,
      boardId: boardId,
    });

    await this.invitationsService.sendInvitation({
      boardId,
      invitedUserId: invitationDTO.targetUserId,
      roleId: invitationDTO?.roleId,
      senderUserId: user.id,
    });
  }

  @Post('/boards/:boardId/invitations/bulk')
  async inviteUserBulk(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('boardId') boardId: string,
    @Body() invitationDTO: CreateBulkInvitationsDTO,
    @GetUser() user: User,
  ) {
    await authorize({
      action: BOARD_ACTIONS.INVITE,
      subjectTag: SUBJECT.BOARD,
      boardId: boardId,
    });

    await this.invitationsService.sendInvitationBulk(
      invitationDTO.invitations,
      user.id,
      boardId,
    );
  }

  @Post('/invitations/:id/accept')
  async accept(
    @Param('id') id: string,
    @AuthorizationPolicy(InvitationPolicy)
    authorize: AuthPolicyFn<InvitationPolicy>,
  ) {
    const invitation = await this.invitationsService.getOneInvitation(id);

    await authorize({ action: INVITATION_ACTIONS.ACCEPT, invitation });

    return this.boardMembersService.createBoardMembership(
      invitation.id,
      invitation.invitedUserId,
      invitation.boardId,
      invitation.roleId,
    );
  }

  @Delete('/invitations/:id')
  async deleteInvitation(
    @Param('id') id: string,
    @AuthorizationPolicy(InvitationPolicy)
    authorize: AuthPolicyFn<InvitationPolicy>,
  ) {
    const invitation = await this.invitationsService.getOneInvitation(id);

    await authorize({ action: INVITATION_ACTIONS.DELETE, invitation });

    await this.invitationsService.deleteOneInvitation(invitation.id);
  }
}
