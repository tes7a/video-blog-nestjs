import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { User } from 'src/schemas';
import { User as UserType } from 'src/types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: UserType): Promise<string> {
    try {
      const user = await this.userModel
        .findOne({
          $or: [
            { 'accountData.email': userData.accountData.email },
            { 'accountData.login': userData.accountData.login },
          ],
        })
        .lean<UserType>()
        .exec();

      if (user) throw new Error('The user already exists.');

      await this.userModel.create(userData);
      return;
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
      if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred';
    }
  }

  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserType | undefined> {
    const user = await this.userModel
      .findOne({
        $or: [
          { 'accountData.email': loginOrEmail },
          { 'accountData.login': loginOrEmail },
        ],
      })
      .lean<UserType>()
      .exec();

    if (!user) return undefined;

    return {
      ...omit(user, '_id', '__v'),
    };
  }

  async findUserById(userId: string): Promise<UserType> {
    const user = await this.userModel
      .findOne({ id: userId })
      .lean<UserType>()
      .exec();

    if (!user) throw new Error('User not found.');

    return {
      ...omit(user, '_id', '__v'),
    };
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<UserType> {
    const user = await this.userModel
      .findOne({ 'accountData.recoveryCode': recoveryCode })
      .lean<UserType>()
      .exec();

    if (!user) throw new Error('User not found.');

    return {
      ...omit(user, '_id', '__v'),
    };
  }

  async confirmCode(code: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({
        'emailConfirmation.confirmationCode': code,
      });

      if (!user) throw new Error('User not found.');

      if (
        user.emailConfirmation.isConfirmed ||
        user.emailConfirmation!.expirationDate! < new Date()
      )
        throw new Error('Email confirmed, or the code has expired.');

      user.emailConfirmation.isConfirmed = true;

      await user.save();
      return;
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
      if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred';
    }
  }

  async updateUser(userDto: UserType) {
    try {
      let user = await this.userModel.findOne({ id: userDto.id });
      if (!user) throw new Error('User not found');
      user = Object.assign(user, userDto);
      await user.save();
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
      if (e instanceof Error) {
        return e.message;
      }
      return 'Unknown error occurred';
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const { deletedCount } = await this.userModel.deleteOne({ id });

    return deletedCount === 1;
  }
}
