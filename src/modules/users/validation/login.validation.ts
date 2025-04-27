import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginValidation {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  password: string;
}
