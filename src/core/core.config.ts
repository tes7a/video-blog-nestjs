import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEmail, IsNumber, IsString } from 'class-validator';

import { configValidationUtility } from '../setup';

@Injectable()
export class CoreConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT, example: 3000',
    },
  )
  port: number = Number(this.configService.get('PORT'));

  @IsString({
    message: "Set Env variable MONGO_URL, example: 'mongodb://localhost:27017'",
  })
  mongoUri: string = this.configService.get('MONGO_URL');

  @IsEmail({}, { message: 'Set Env variable EMAIL' })
  email: string = this.configService.get('EMAIL');

  @IsString()
  emailPassword: string = this.configService.get('EMAIL_PASSWORD');

  @IsString()
  emailService: string = this.configService.get('EMAIL_SERVICE');

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
