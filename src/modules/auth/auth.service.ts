import { BadRequestException, Injectable } from '@nestjs/common';
import { add } from 'date-fns';
import { v4 } from 'uuid';

import { UsersService } from '../users/users.service';
import { EmailManager } from '../../managers';
import { UsersRepository } from '../users/users.repository';
import { CreateUserDTO } from '../../dto';
import { ErrorType, User } from '../../types';

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

  async passwordRecover(email: string): Promise<string> {
    try {
      const user = await this.usersRepository.findByLoginOrEmail(email);

      const newCode = v4();
      user.accountData.recoveryCode = newCode;

      await this.usersRepository.updateUser(user);
      await this.emailManager.passwordRecover(email, newCode);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return e.message;
      } else if (typeof e === 'string') return e;

      return 'An unknown error occurred';
    }
  }

  async setPassword(recoveryCode: string, newPassword: string) {
    try {
      const user =
        await this.usersRepository.findUserByRecoveryCode(recoveryCode);
      const passwordSalt = await this.usersService.genSalt();
      const passwordHash = await this.usersService._generateHash(
        newPassword,
        passwordSalt,
      );

      user.accountData.passwordHash = passwordHash;
      user.accountData.passwordSalt = passwordSalt;

      await this.usersRepository.updateUser(user);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return e.message;
      } else if (typeof e === 'string') return e;

      return 'An unknown error occurred';
    }
  }

  async registerUser(data: CreateUserDTO) {
    const confirmationCode = v4();

    const result: User | string | ErrorType =
      await this.usersService.registerUser(data, confirmationCode);

    if (typeof result === 'string') throw new BadRequestException(result);
    if ('field' in result) throw new BadRequestException(result);

    await this.emailManager.sendEmail(
      result.accountData.email,
      confirmationCode,
    );
  }

  async confirmCode(code: string) {
    return await this.usersRepository.confirmCode(code);
  }

  async resendingEmail(email: string): Promise<string | ErrorType> {
    try {
      const user = await this.usersRepository.findByLoginOrEmail(email);

      if (!user) {
        throw {
          message: 'User not found.',
          field: 'email',
        };
      } else if (user.emailConfirmation.isConfirmed) {
        throw {
          message: 'Your email has been confirmed.',
          field: 'email',
        };
      }

      const newCode = v4();
      user.emailConfirmation.confirmationCode = newCode;
      user.emailConfirmation.expirationDate = add(new Date(), {
        minutes: 5,
      });

      await this.usersRepository.updateUser(user);
      await this.emailManager.sendEmail(email, newCode);
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      } else if (typeof e === 'string') {
        return e;
      } else if ('field' in e) {
        return e;
      }

      return 'An unknown error occurred';
    }
  }
}
