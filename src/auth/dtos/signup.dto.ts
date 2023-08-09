import { IsEmail, IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
