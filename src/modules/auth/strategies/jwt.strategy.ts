import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { JwtPayload, User } from '../../../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
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
