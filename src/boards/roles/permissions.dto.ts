import { IsBoolean, IsOptional } from 'class-validator';

export class PermissionDTO {
  @IsBoolean()
  @IsOptional()
  canEditCard: boolean;

  @IsBoolean()
  @IsOptional()
  canDeleteCard: boolean;

  @IsBoolean()
  @IsOptional()
  canCreateCard: boolean;

  @IsBoolean()
  @IsOptional()
  canDeleteColumn: boolean;

  @IsBoolean()
  @IsOptional()
  canEditColumn: boolean;

  @IsBoolean()
  @IsOptional()
  canCreateColumn: boolean;

  @IsBoolean()
  @IsOptional()
  canInviteUsers: boolean;

  @IsBoolean()
  @IsOptional()
  canCreateRoles: boolean;
}
