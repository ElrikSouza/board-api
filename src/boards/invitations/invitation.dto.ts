import { IsEmail, IsOptional, IsUUID } from 'class-validator';

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
