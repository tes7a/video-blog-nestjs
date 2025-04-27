import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordValidation {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  recoveryCode: string;
}
