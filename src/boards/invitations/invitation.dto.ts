import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class InvitationDTO {
  @IsUUID()
  targetUserId: string;

  @IsUUID()
  @IsOptional()
  roleId?: string;
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
