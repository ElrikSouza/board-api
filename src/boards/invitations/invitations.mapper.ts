import { User } from 'src/users/user.entity';
import { SendInvitationBO } from './bo/send-invitation.bo';
import { SendInvitationsBulkBO } from './bo/send-invitations-bulk.bo';
import {
  CreateBulkInvitationsDTO,
  CreateInvitationDTO,
  InvitationDTO,
} from './invitation.dto';
import { Invitation } from './invitation.entity';

export class InvitationsMapper {
  static fromEntityToDTO(invitation: Invitation) {
    const dto = new InvitationDTO();

    dto.id = invitation.id;
    dto.boardId = invitation.board?.id;
    dto.boardName = invitation.board?.title;
    dto.senderUserName = invitation.senderUser?.fullName;

    return dto;
  }

  static fromSendOneDTOToBO(
    dto: CreateInvitationDTO,
    extraParams: { boardId: string; senderId: string },
  ) {
    const bo = new SendInvitationBO();

    bo.targetEmail = dto.targetEmail;
    bo.roleId = dto.roleId;
    bo.boardId = extraParams.boardId;
    bo.senderId = extraParams.senderId;

    return bo;
  }

  static fromSendOneDTOToEntity(
    dto: CreateInvitationDTO,
    extraParams: { boardId: string; senderId: string; targetId: string },
  ) {
    const invitation = new Invitation();

    invitation.boardId = extraParams.boardId;
    invitation.invitedUserId = extraParams.targetId;
    invitation.senderUserId = extraParams.senderId;
    invitation.roleId = dto.roleId;

    return invitation;
  }

  static fromSendInvitationBoToEntity(
    bo: SendInvitationBO,
    extraParams: { targetUser: Pick<User, 'id'> },
  ) {
    const invitationEntity = new Invitation();

    invitationEntity.boardId = bo.boardId;
    invitationEntity.roleId = bo.roleId;
    invitationEntity.senderUserId = bo.senderId;
    invitationEntity.invitedUserId = extraParams.targetUser.id;

    return invitationEntity;
  }

  static fromSendBulkDTOToBulkBO(
    dto: CreateBulkInvitationsDTO,
    extraParams: { senderUser: Pick<User, 'id'>; boardId: string },
  ) {
    const bo = new SendInvitationsBulkBO();

    bo.invitations = dto.invitations;

    bo.boardId = extraParams.boardId;
    bo.senderId = extraParams.senderUser.id;

    return bo;
  }
}
