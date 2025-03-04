import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfig {
  getUserNameField(): string {
    return process.env.USERNAME_FIELD ?? 'loginOrEmail';
  }

  getPasswordField(): string {
    return process.env.PASSWORD_FIELD ?? 'password';
  }

  getJwtSecret(): string {
    return process.env.JWT_SECRET ?? 'secret';
  }
}
