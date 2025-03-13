import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as PassportBasicStrategy } from 'passport-http';

import { UsersConfig } from '../config/users.config';

@Injectable()
export class BasicStrategy extends PassportStrategy(PassportBasicStrategy) {
  constructor(private usersConfig: UsersConfig) {
    super();
  }

  validate(username: string, password: string): boolean {
    const isValid =
      username === this.usersConfig.adminLogin &&
      password === this.usersConfig.adminPassword;

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
