import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { PermissionDTO } from './permissions.dto';

export class CreateRoleDTO {
  @IsString()
  label: string;

  @ValidateNested()
  @Type(() => PermissionDTO)
  permissions: PermissionDTO;
}
