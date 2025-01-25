import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { User } from '../schemas';
import { CreateUserOutput, User as UserType } from '../types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: UserType): Promise<CreateUserOutput | string> {
    const {
      id,
      accountData: { createdAt, email, login },
    } = userData;
    try {
      await this.userModel.create(userData);
      return {
        id,
        login,
        email,
        createdAt,
      };
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
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

  async deleteUser(id: string): Promise<boolean> {
    const { deletedCount } = await this.userModel.deleteOne({ id });

    return deletedCount === 1;
  }
}
