import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';

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

  async deleteUser(id: string): Promise<boolean> {
    const { deletedCount } = await this.userModel.deleteOne({ id });

    return deletedCount === 1;
  }
}
