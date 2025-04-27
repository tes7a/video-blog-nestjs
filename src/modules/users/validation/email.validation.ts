import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class EmailValidation {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Transform(({ value }) => value?.trim())
  email: string;
}
