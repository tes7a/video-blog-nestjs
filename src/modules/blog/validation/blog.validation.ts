import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class BlogValidation {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(
    '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
    undefined,
    {
      message:
        'Username must start with a letter and contain only letters and numbers',
    },
  )
  @MaxLength(100)
  websiteUrl: string;
}
