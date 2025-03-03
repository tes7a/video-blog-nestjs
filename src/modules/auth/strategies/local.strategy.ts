import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { AuthConfig } from '../config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private authConfig: AuthConfig,
  ) {
    super({
      usernameField: authConfig.getUserNameField(),
      passwordField: authConfig.getPasswordField(),
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
