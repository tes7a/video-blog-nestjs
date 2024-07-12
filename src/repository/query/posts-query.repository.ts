import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { Post } from '../../schemas';
import { GetPostsDTO } from '../../dto';
import { NewestLikes, UserRatings } from '../../types';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getAllPosts(payload: {
    blogId?: string;
    userId?: string;
    query: GetPostsDTO;
  }) {
    const {
      blogId,
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
        blogId: { $regex: blogId ?? '' },
      };

      const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);
      const totalCount = await this.postModel.countDocuments(filterCondition);

      const filteredArray = await this.postModel
        .find(filterCondition, {
          projection: { _id: 0 },
        })
        .find()
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(startIndex)
        .limit(Number(pageSize))
        .lean();

      const pagesCount = Math.ceil(totalCount / Number(pageSize));
      const items = filteredArray.map((post) => {
        return {
          ...omit(post, '_id', '__v'),
          extendedLikesInfo: {
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            likesCount: post.extendedLikesInfo.likesCount,
            myStatus: this._getMyStatus(
              post.extendedLikesInfo.userRatings,
              userId,
            ),
            newestLikes: this._getNewestLikes(
              post.extendedLikesInfo.newestLikes,
              userId,
            ),
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

  _getNewestLikes(newestLikes: Array<NewestLikes>, userId?: string) {
    if (!newestLikes || !newestLikes.length) return [];
    return newestLikes
      .filter((like) => like.userId === userId)
      .map((like) => ({
        addedAt: like.addedAt,
        userId: like.userId,
        login: like.login,
      }))
      .slice(0, 3);
  }
}
