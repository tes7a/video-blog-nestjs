import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Strategy } from 'passport-local';

import { AuthService } from '../services/auth.service';
import { UsersConfig } from '../config/users.config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    userConfig: UsersConfig,
  ) {
    super({
      usernameField: userConfig.usernameField,
      passwordField: userConfig.passwordField,
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
