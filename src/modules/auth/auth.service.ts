import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { User } from 'src/types';
import { CreateUserDTO } from 'src/dto';
import { UsersService } from '../users/users.service';
import { EmailManager } from 'src/managers';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

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

  async findUserById(userId: string) {
    return await this.usersService.findUserById(userId);
  }

  async registerUser(data: CreateUserDTO) {
    const confirmationCode = v4();

    const result: User | string = await this.usersService.registerUser(
      data,
      confirmationCode,
    );

    if (typeof result === 'string') throw new BadRequestException(result);

    await this.emailManager.sendEmail(
      result.accountData.email,
      confirmationCode,
    );
  }

  async confirmCode(code: string) {
    return await this.usersRepository.confirmCode(code);
  }
}
