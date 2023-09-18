import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class InvitationDTO {
  id: string;
  senderUserName: string;
  boardName: string;
  boardId: string;
}

export class CreateInvitationDTO {
  @IsEmail()
  targetEmail: string;

  @IsUUID()
  @IsOptional()
  roleId?: string;
}

export class CreateBulkInvitationsDTO {
  @ValidateNested({ each: true })
  @Type(() => CreateInvitationDTO)
  invitations: CreateInvitationDTO[];
}
