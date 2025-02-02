import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordValidation {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
