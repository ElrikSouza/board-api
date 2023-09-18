import { CreateInvitationDTO } from '../invitation.dto';

export class SendInvitationsBulkBO {
  invitations: CreateInvitationDTO[];
  boardId: string;
  senderId: string;
}
