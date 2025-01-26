import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { JwtPayload, User } from 'src/types';

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
    const {
      id,
      accountData: { email, login },
    } = await this.authService.findUserById(userId);

    return { id, email, login };
  }
}
