import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { omit } from 'lodash';

import { Comment } from '../../schemas';
import { GetCommentOutput } from '../../types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async geCommentById(id: string): Promise<GetCommentOutput | undefined> {
    const comment = await this.commentModel.findOne({ id }).lean();

    if (!comment) return undefined;

    return { ...omit(comment, ['_id', '__v', 'postId', 'userRatings']) };
  }
}
