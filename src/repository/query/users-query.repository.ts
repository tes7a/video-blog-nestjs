import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { map, pick } from 'lodash';

import { User } from '../../schemas';
import { GetUsersOutput } from '../../types';
import { GetUsersDTO } from '../../dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(query: GetUsersDTO): Promise<GetUsersOutput | string> {
    const {
      pageNumber = 1,
      pageSize = 10,
      searchEmailTerm,
      searchLoginTerm,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = query;

    try {
      const emailSearchCondition = {
        'accountData.email': {
          $regex: searchEmailTerm ?? '',
          $options: 'i',
        },
      };
      const loginSearchCondition = {
        'accountData.login': {
          $regex: searchLoginTerm ?? '',
          $options: 'i',
        },
      };

      const searchConditions = {
        $or: [emailSearchCondition, loginSearchCondition],
      };

      const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);

      const totalCount = await this.userModel.countDocuments(searchConditions);

      const sortedUsers = await this.userModel
        .find(searchConditions, {
          projection: { _id: 0 },
        })
        .sort({ [`accountData.${sortBy}`]: sortDirection === 'asc' ? 1 : -1 })
        .skip(startIndex)
        .limit(Number(pageSize))
        .lean();

      const pagesCount = Math.ceil(totalCount / Number(pageSize));

      const items = map(sortedUsers, (user) => ({
        id: user.id,
        ...pick(user.accountData, ['email', 'login', 'createdAt']),
      }));

      return {
        pagesCount,
        page: Number(pageNumber),
        pageSize: Number(pageSize),
        totalCount,
        items,
      };
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
    }
  }
}
