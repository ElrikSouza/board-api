import { PartialType } from '@nestjs/swagger';
import { CreateCardDTO } from './create-card.dto';

export class UpdateCardDTO extends PartialType(CreateCardDTO) {}
