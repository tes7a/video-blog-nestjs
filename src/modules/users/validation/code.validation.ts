import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class CodeValidation {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  code: string;
}
