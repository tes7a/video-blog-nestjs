import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as PassportBasicStrategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(PassportBasicStrategy) {
  constructor() {
    super();
  }

  validate(username: string, password: string): boolean {
    const isValid =
      username === process.env.BASIC_USERNAME &&
      password === process.env.BASIC_PASSWORD;

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
