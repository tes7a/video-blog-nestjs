import { IsNotEmpty, IsString } from 'class-validator';

export class CodeValidation {
  @IsString()
  @IsNotEmpty()
  code: string;
}
