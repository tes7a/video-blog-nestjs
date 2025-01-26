import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { CreateCommentDTO } from 'src/dto';
import { GetCommentsOutput, UserRatings } from 'src/types';
import { Comment } from 'src/schemas';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getAllComments(payload: {
    postId: string;
    query: CreateCommentDTO;
    userId?: string;
  }): Promise<GetCommentsOutput | string> {
    const {
      postId,
      userId,
      query: {
        pageNumber = 1,
        pageSize = 10,
        sortBy = 'createdAt',
        sortDirection = 'desc',
      },
    } = payload;

    try {
      const filterCondition = {
        postId: { $regex: postId ?? '' },
      };

      const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);
      const totalCount = await this.commentModel.countDocuments({
        postId,
      });

      const filteredArray = await this.commentModel
        .find(filterCondition, { projection: { _id: 0 } })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(startIndex)
        .limit(Number(pageSize))
        .lean();

      const pagesCount = Math.ceil(totalCount / Number(pageSize));

      const items = filteredArray.map((comment) => {
        return {
          ...omit(comment, '_id', '__v'),
          likesInfo: {
            dislikesCount: comment.likesInfo.dislikesCount,
            likesCount: comment.likesInfo.likesCount,
            myStatus: this._getMyStatus(comment.likesInfo.userRatings, userId),
          },
        };
      });

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

  _getMyStatus(userRatings?: Array<UserRatings>, userId?: string) {
    const userRating = userRatings?.find((user) => user.userId === userId);
    return userRating ? userRating.userRating : 'None';
  }
}
