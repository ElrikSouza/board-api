import { IsBoolean, IsOptional } from 'class-validator';

export class PermissionDTO {
  @IsBoolean()
  @IsOptional()
  canMoveCard: boolean;

  @IsBoolean()
  @IsOptional()
  canDeleteCard: boolean;

  @IsBoolean()
  @IsOptional()
  canOpenCard: boolean;

  @IsBoolean()
  @IsOptional()
  canArchiveColumn: boolean;

  @IsBoolean()
  @IsOptional()
  canDeleteColumn: boolean;

  @IsBoolean()
  @IsOptional()
  canMoveColumn: boolean;
}
