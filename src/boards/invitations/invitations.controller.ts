import {
  Body,
  Controller,
  Delete,
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
import { InvitationDTO } from './invitation.dto';
import { InvitationsService } from './invitations.service';

@UseGuards(LoggedInGuard)
@Controller('')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly boardMembersService: BoardMembersService,
  ) {}

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

  @Post('/invitations/:id/accept')
  async accept(
    @GetUser() user: User,
    @Param('id') id: string,
    @AuthorizationPolicy(InvitationPolicy)
    authorize: AuthPolicyFn<InvitationPolicy>,
  ) {
    const invitation = await this.invitationsService.getOneInvitation(id);

    await authorize({ action: INVITATION_ACTIONS.ACCEPT, invitation });

    return this.boardMembersService.createBoardMembership(
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
