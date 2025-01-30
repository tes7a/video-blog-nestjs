import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { genSalt, hash } from 'bcrypt';
import { add } from 'date-fns';

import { UsersRepository } from './users.repository';
import { CreateUserDTO } from 'src/dto';
import { CreateUserOutput, User } from 'src/types';
import { UserDBModel } from 'src/models';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUserByAdmin(
    data: CreateUserDTO,
  ): Promise<CreateUserOutput | string> {
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
        expirationDate: new Date(),
        isConfirmed: true,
      },
    });

    const errors = await this.usersRepository.createUser(params);
    if (errors) return errors;

    return {
      id: params.id,
      login: params.accountData.login,
      createdAt: params.accountData.createdAt,
      email: params.accountData.email,
    };
  }

  async registerUser(
    data: CreateUserDTO,
    confirmationCode: string,
  ): Promise<User | string> {
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
        confirmationCode,
        expirationDate: add(new Date(), {
          seconds: 30,
        }),
        isConfirmed: false,
      },
    });

    const errors = await this.usersRepository.createUser(params);
    if (errors) return errors;

    return params;
  }

  async findUserById(userId: string): Promise<User> {
    return await this.usersRepository.findUserById(userId);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }

  async verificationCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<undefined | User> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user?.emailConfirmation?.isConfirmed) return undefined;

    const passwordHash = await this._generateHash(
      password,
      user.accountData.passwordSalt,
    );

    if (user.accountData.passwordHash !== passwordHash) return undefined;

    return user;
  }

  private async _generateHash(password: string, salt: string) {
    return await hash(password, salt);
  }
}
