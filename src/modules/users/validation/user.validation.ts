import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
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

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  password: string;
}
