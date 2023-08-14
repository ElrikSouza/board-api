import { IsOptional, IsUUID } from 'class-validator';

export class InvitationDTO {
  @IsUUID()
  targetUserId: string;

  @IsUUID()
  @IsOptional()
  roleId?: string;
}
