import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistrationValidation {
  @MinLength(3)
  @MaxLength(10)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches('[a-zA-Z0-9_-]*$', undefined, {
    message:
      'Username must start with a letter and contain only letters and numbers',
  })
  login: string;

  @MinLength(6)
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  email: string;
}
