import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateCardDTO } from './create-card.dto';

export class UpdateCardDTO extends PartialType(CreateCardDTO) {
  @IsUUID()
  @IsOptional()
  columnId?: string;
}
