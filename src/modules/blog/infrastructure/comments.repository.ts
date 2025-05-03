import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { omit } from 'lodash';

import { Comment } from '../schemas';
import { CommentType, GetCommentOutputType } from '../models/comment';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async geCommentById(
    id: string,
    userId?: string,
  ): Promise<GetCommentOutputType | undefined> {
    const comment = await this.commentModel.findOne({ id }).lean();

    if (!comment) return undefined;

    let myStatus: 'None' | 'Like' | 'Dislike' = 'None';

    if (userId && comment.likesInfo.userRatings?.length) {
      const userRatingEntry = comment.likesInfo.userRatings.find(
        (ur) => ur.userId === userId,
      );
      if (userRatingEntry) {
        myStatus = userRatingEntry.userRating as 'Like' | 'Dislike';
      }
    }

    const cleanedComment = omit(comment, [
      '_id',
      '__v',
      'postId',
      'likesInfo.userRatings',
    ]);

    return {
      ...cleanedComment,
      likesInfo: {
        ...cleanedComment.likesInfo,
        myStatus,
      },
    };
  }

  async createComment(newComment: CommentType): Promise<GetCommentOutputType> {
    await this.commentModel.create(newComment);

    return {
      ...omit(newComment, ['_id', '__v', 'postId', 'likesInfo.userRatings']),
    };
  }

  async updateComment(params: {
    id: string;
    userId: string;
    content: string;
  }): Promise<void> {
    const { id, userId, content } = params;
    const comment = await this.commentModel.findOne({ id });

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId !== userId)
      throw new ForbiddenException();

    comment.content = content;
    await comment.save();
  }

  async updateLikeStatus(params: {
    id: string;
    userId: string;
    likeStatus: string;
  }): Promise<void> {
    const { id, userId, likeStatus } = params;

    const comment = await this.commentModel.findOne({ id });
    if (!comment) throw new NotFoundException();

    const likesInfo = comment.likesInfo;

    if (!likesInfo.userRatings) likesInfo.userRatings = [];

    const currentUser = likesInfo.userRatings.find((u) => u.userId === userId);

    const incrementLike = () => {
      likesInfo.likesCount++;
    };

    const decrementLike = () => {
      likesInfo.likesCount = Math.max(0, likesInfo.likesCount - 1);
    };

    const incrementDislike = () => {
      likesInfo.dislikesCount++;
    };

    const decrementDislike = () => {
      likesInfo.dislikesCount = Math.max(0, likesInfo.dislikesCount - 1);
    };

    switch (likeStatus) {
      case 'Like':
        if (currentUser) {
          if (currentUser.userRating === 'Like') return;
          if (currentUser.userRating === 'Dislike') decrementDislike();
          currentUser.userRating = 'Like';
        } else {
          likesInfo.userRatings.push({ userId, userRating: 'Like' });
        }
        incrementLike();
        break;

      case 'Dislike':
        if (currentUser) {
          if (currentUser.userRating === 'Dislike') return;
          if (currentUser.userRating === 'Like') decrementLike();
          currentUser.userRating = 'Dislike';
        } else {
          likesInfo.userRatings.push({ userId, userRating: 'Dislike' });
        }
        incrementDislike();
        break;

      case 'None':
        if (!currentUser) return;
        if (currentUser.userRating === 'Like') decrementLike();
        if (currentUser.userRating === 'Dislike') decrementDislike();
        currentUser.userRating = 'None';
        break;

      default:
        return;
    }

    likesInfo.myStatus = likeStatus;

    await comment.save();
    return;
  }

  async deleteComment(params: {
    id: string;
    userId: string;
  }): Promise<boolean> {
    const { id, userId } = params;
    const comment = await this.commentModel.findOne({ id }).lean();

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId !== userId)
      throw new ForbiddenException();

    const { deletedCount } = await this.commentModel.deleteOne({ id });

    return deletedCount === 1;
  }
}
