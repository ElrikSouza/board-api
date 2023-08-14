import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { RuleDTO } from './rule.dto';

export class CreateRoleDTO {
  @IsString()
  label: string;

  @ValidateNested({ each: true })
  @Type(() => RuleDTO)
  rules: RuleDTO[];
}
