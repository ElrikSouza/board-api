import { ApiProperty } from '@nestjs/swagger';

export class BoardEntryDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'The id of the owner of the board' })
  userId: string;

  @ApiProperty()
  title: string;
}
