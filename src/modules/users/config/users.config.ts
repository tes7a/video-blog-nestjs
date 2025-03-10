import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsString } from 'class-validator';

import { configValidationUtility } from '../../../setup';

@Injectable()
export class UsersConfig {
  @IsString({
    message: 'Set Env variable USERNAME_FIELD, example: loginOrEmail',
  })
  usernameField: string = this.configService.get('USERNAME_FIELD');

  @IsString({
    message: 'Set Env variable PASSWORD_FIELD, example: password',
  })
  passwordField: string = this.configService.get('PASSWORD_FIELD');

  @IsString({
    message: 'Set Env variable JWT_SECRET, example: secret',
  })
  jwtSecret: string = this.configService.get('JWT_SECRET');

  @IsString({
    message: 'Set Env variable BASIC_USERNAME, example: admin',
  })
  adminLogin: string = this.configService.get('BASIC_USERNAME');

  @IsString({
    message: 'Set Env variable BASIC_PASSWORD, example: qwerty',
  })
  adminPassword: string = this.configService.get('BASIC_PASSWORD');

  @IsString({
    message: 'Set Env variable TOKEN_TIME_EXPIRATION, example: 5m',
  })
  timeExpiration: string | number = this.configService.get(
    'TOKEN_TIME_EXPIRATION',
  );

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
