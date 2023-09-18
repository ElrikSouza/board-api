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
import { BOARD_ACTIONS, BoardPolicy, SUBJECT } from '../board.policy';
import { INVITATION_ACTIONS, InvitationPolicy } from './InvitationPolicy';
import {
  CreateBulkInvitationsDTO,
  CreateInvitationDTO,
} from './invitation.dto';
import { InvitationsMapper } from './invitations.mapper';
import { InvitationsService } from './invitations.service';

@UseGuards(LoggedInGuard)
@Controller('')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get('/invitations')
  async getInvitations(@GetUser() user: User) {
    const invitations = await this.invitationsService.getInvitationsByUserId(
      user.id,
    );

    return invitations.map(InvitationsMapper.fromEntityToDTO);
  }

  @Post('/boards/:boardId/invitations')
  async inviteUser(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('boardId') boardId: string,
    @Body() invitationDTO: CreateInvitationDTO,
    @GetUser() user: User,
  ) {
    await authorize({
      action: BOARD_ACTIONS.INVITE,
      subjectTag: SUBJECT.BOARD,
      boardId: boardId,
    });

    const sendOneBO = InvitationsMapper.fromSendOneDTOToBO(invitationDTO, {
      boardId,
      senderId: user.id,
    });

    await this.invitationsService.sendInvitation(sendOneBO);
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

    const invitationsBulkBO = InvitationsMapper.fromSendBulkDTOToBulkBO(
      invitationDTO,
      { boardId, senderUser: user },
    );

    await this.invitationsService.sendInvitationBulk(invitationsBulkBO);
  }

  @Post('/invitations/:id/accept')
  async accept(
    @Param('id') id: string,
    @AuthorizationPolicy(InvitationPolicy)
    authorize: AuthPolicyFn<InvitationPolicy>,
  ) {
    const invitation = await this.invitationsService.getOneInvitation(id);

    await authorize({ action: INVITATION_ACTIONS.ACCEPT, invitation });

    await this.invitationsService.acceptInvitation(invitation);
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
