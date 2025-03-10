import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtPayload, User } from '../../../types';
import { AuthService } from '../services/auth.service';
import { UsersConfig } from '../config/users.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    userConfig: UsersConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userConfig.jwtSecret,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<Pick<User, 'id'> & Pick<User['accountData'], 'email' | 'login'>> {
    const { userId } = payload;
    const user = await this.authService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please check your credentials.',
      );
    }

    return {
      id: user.id,
      email: user.accountData.email,
      login: user.accountData.login,
    };
  }
}
