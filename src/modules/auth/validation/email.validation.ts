import { IsNotEmpty, IsString } from 'class-validator';

export class EmailValidation {
  @IsString()
  @IsNotEmpty()
  email: string;
}
