import { IsOptional, IsString } from 'class-validator';

export class CreateCardDTO {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
