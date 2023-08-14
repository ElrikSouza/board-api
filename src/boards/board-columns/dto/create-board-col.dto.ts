import { IsString } from 'class-validator';

export class CreateBoardColumnDTO {
  @IsString()
  title: string;
}
