import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { genSalt, hash } from 'bcrypt';

import { CreateUserDTO } from 'src/dto';
import { UserDBModel } from 'src/models';
import { UsersRepository } from 'src/repository';
import { CreateUserOutput } from 'src/types';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(data: CreateUserDTO): Promise<CreateUserOutput | string> {
    const { email, login, password } = data;
    const passwordSalt = await genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const userData = new UserDBModel(
      v4(),
      '',
      {
        email,
        passwordHash,
        passwordSalt,
        recoveryCode: '',
        login,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: '',
        expirationDate: new Date(),
        isConfirmed: true,
      },
    );

    return await this.usersRepository.createUser(userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }

  async _generateHash(password: string, salt: string) {
    return await hash(password, salt);
  }
}
