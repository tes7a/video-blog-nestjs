import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { genSalt, hash } from 'bcrypt';

import { CreateUserDTO } from '../dto';
import { UserDBModel } from '../models';
import { UsersRepository } from '../repository';
import { CreateUserOutput } from '../types';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(data: CreateUserDTO): Promise<CreateUserOutput | string> {
    const { email, login, password } = data;
    const passwordSalt = await genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const { params } = new UserDBModel({
      id: v4(),
      token: '',
      accountData: {
        email,
        passwordHash,
        passwordSalt,
        recoveryCode: '',
        login,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: '',
        expirationDate: new Date().toISOString(),
        isConfirmed: true,
      },
    });

    return await this.usersRepository.createUser(params);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }

  async _generateHash(password: string, salt: string) {
    return await hash(password, salt);
  }
}
