import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserValidation {
  @MinLength(3)
  @MaxLength(10)
  @Matches('[a-zA-Z0-9_-]*$', undefined, {
    message:
      'Username must start with a letter and contain only letters and numbers',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  password: string;
}
