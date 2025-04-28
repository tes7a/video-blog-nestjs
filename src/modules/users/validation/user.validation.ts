import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserValidation {
  //testcomment
  @MinLength(3)
  @MaxLength(10)
  @Matches('[a-zA-Z0-9_-]*$', undefined, {
    message:
      'Username must start with a letter and contain only letters and numbers',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string;

  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  password: string;
}
