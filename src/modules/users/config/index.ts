import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersConfig {
  getAdminLogin() {
    return process.env.BASIC_USERNAME ?? 'admin';
  }

  getAdminPassword() {
    return process.env.BASIC_PASSWORD ?? 'qwerty';
  }
}
