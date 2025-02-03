import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { User } from '../../../types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: process.env.USERNAME_FIELD,
      passwordField: process.env.PASSWORD_FIELD,
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: User['id'] }> {
    const user = await this.authService.validateUser(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please check your credentials.',
      );
    }

    return { id: user.id };
  }
}
