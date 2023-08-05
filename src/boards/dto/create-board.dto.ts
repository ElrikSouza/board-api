import { IsString } from 'class-validator';

export class CreateBoardDTO {
  @IsString()
  title: string;
}
