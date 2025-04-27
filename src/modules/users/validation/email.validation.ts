import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailValidation {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  email: string;
}
