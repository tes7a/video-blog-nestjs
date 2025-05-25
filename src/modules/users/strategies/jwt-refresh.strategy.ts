import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRepository } from '../infrastructure';
import { UsersConfig } from '../config/users.config';
import { UserType } from '../models';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private usersRepository: UsersRepository,
    private userConfig: UsersConfig,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.refreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: userConfig.refreshTokenSecret,
    });
  }

  async validate(payload: JwtPayload<UserType>) {
    const {
      user: { id: userId },
    } = payload;

    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please check your credentials.',
      );
    }

    const accessToken = await this.accessTokenContext.sign(
      { user },
      { expiresIn: this.userConfig.refreshedAccessTokenTime },
    );

    const refreshToken = await this.refreshTokenContext.sign({ user });

    return { accessToken, refreshToken };
  }
}
