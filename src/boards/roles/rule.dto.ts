import { IsObject, IsOptional, IsString } from 'class-validator';

export class RuleDTO {
  @IsString()
  action: string;

  @IsString()
  subject: string;

  @IsObject()
  @IsOptional()
  condition?: object;
}
