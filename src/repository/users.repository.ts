import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';

import { UserDBModel } from 'src/models';
import { User as UserSchema } from 'src/schemas';
import { CreateUserOutput } from 'src/types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {}

  async createUser(userData: UserDBModel): Promise<CreateUserOutput | string> {
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
