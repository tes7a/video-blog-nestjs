import { IsNotEmpty, IsString } from 'class-validator';

export class LoginValidation {
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
