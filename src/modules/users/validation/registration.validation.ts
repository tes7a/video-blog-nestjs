import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class RegistrationValidation {
  @MinLength(3)
  @MaxLength(10)
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @Matches('[a-zA-Z0-9_-]*$', undefined, {
    message:
      'Username must start with a letter and contain only letters and numbers',
  })
  login: string;

  @MinLength(6)
  @MaxLength(20)
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  email: string;
}
