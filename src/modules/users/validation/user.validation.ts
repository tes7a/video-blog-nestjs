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

export class UserValidation {
  @MinLength(3)
  @MaxLength(10)
  @Matches('[a-zA-Z0-9_-]*$', undefined, {
    message:
      'Username must start with a letter and contain only letters and numbers',
  })
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  email: string;

  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  password: string;
}
