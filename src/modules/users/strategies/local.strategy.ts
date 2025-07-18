import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Strategy } from 'passport-local';
import { v4 } from 'uuid';

import { UsersConfig } from '../config/users.config';
import { AuthService } from '../services';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    userConfig: UsersConfig,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {
    super({
      usernameField: userConfig.usernameField,
      passwordField: userConfig.passwordField,
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: string; deviceId: string } & Tokens> {
    const user = await this.authService.validateUser(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please check your credentials.',
      );
    }

    const deviceId = v4();
    const payload = { user, deviceId };

    const accessToken = await this.accessTokenContext.sign(payload);
    const refreshToken = await this.refreshTokenContext.sign(payload);

    return { id: user.id, accessToken, refreshToken, deviceId };
  }
}
