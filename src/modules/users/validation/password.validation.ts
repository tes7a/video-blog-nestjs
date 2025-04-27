import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class PasswordValidation {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
