import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class ContentValidation {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  @MinLength(20)
  @MaxLength(300)
  content: string;
}
