import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { User } from '../../../types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      usernameField: process.env.USERNAME_FIELD,
      passwordField: process.env.PASSWORD_FIELD,
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.authService.validateUser(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please check your credentials.',
      );
    }

    const accessToken = await this.jwtService.sign({ user });

    return { accessToken };
  }
}
