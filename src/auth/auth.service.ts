import { Injectable } from '@nestjs/common';

import { User } from 'src/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersService.verificationCredentials(
      loginOrEmail,
      password,
    );

    if (!user) return undefined;

    return user;
  }
}
