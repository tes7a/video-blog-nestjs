import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';

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
    message: 'Set Env variable BASIC_USERNAME, example: admin',
  })
  adminLogin: string = this.configService.get('BASIC_USERNAME');

  @IsString({
    message: 'Set Env variable BASIC_PASSWORD, example: qwerty',
  })
  adminPassword: string = this.configService.get('BASIC_PASSWORD');

  @IsString({
    message: 'Set Env variable ACCESS_TOKEN_SECRET, example: secret',
  })
  accessTokenSecret: string | Buffer = this.configService.get(
    'ACCESS_TOKEN_SECRET',
  );

  @IsString({
    message: 'Set Env variable TOKEN_TIME_EXPIRATION, example: 5m',
  })
  accessTokenExpireIn: string | number = this.configService.get(
    'ACCESS_TOKEN_TIME_EXPIRATION',
  );

  @IsString({
    message: 'Set Env variable REFRESH_TOKEN_SECRET, example: secret',
  })
  refreshTokenSecret: string | Buffer = this.configService.get(
    'REFRESH_TOKEN_SECRET',
  );

  @IsString({
    message: 'Set Env variable TOKEN_TIME_EXPIRATION, example: 5m',
  })
  refreshTokenExpireIn: string | number = this.configService.get(
    'REFRESH_TOKEN_TIME_EXPIRATION',
  );

  @IsNumber(
    {},
    {
      message:
        'Set Env variable COOKIE_TOKEN_TIME_EXPIRATION in milliseconds, example: 60*60*1000*1 = 1 hour',
    },
  )
  cookieTokenExpireIn: number =
    +this.configService.get('COOKIE_TOKEN_TIME_EXPIRATION') ||
    +process.env.COOKIE_TOKEN_TIME_EXPIRATION;

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
