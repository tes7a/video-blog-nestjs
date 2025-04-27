import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, NotContains } from 'class-validator';

export class PostValidation {
  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @MaxLength(1000)
  content: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  blogId: string;
}

export class PostByIdValidation {
  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @MaxLength(1000)
  content: string;
}
