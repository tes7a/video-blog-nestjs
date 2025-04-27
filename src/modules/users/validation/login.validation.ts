import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class LoginValidation {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  password: string;
}
