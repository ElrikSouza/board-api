import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBoardDTO {
  @ApiProperty()
  @IsString()
  title: string;
}
