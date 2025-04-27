import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CodeValidation {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  code: string;
}
