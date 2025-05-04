import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { Post } from '../schemas';
import { UpdateLikePostDto, UpdatePostDTO } from '../dto';
import { PostType } from '../models';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getPostById(
    id: string,
    userId?: string,
  ): Promise<PostType | undefined> {
    const post = await this.postModel.findOne({ id }).lean();

    if (!post) return undefined;

    const { extendedLikesInfo } = post;
    const userRatings = extendedLikesInfo?.userRatings ?? [];
    const newestLikes = extendedLikesInfo?.newestLikes ?? [];

    const userRatingEntry = userRatings.find((ur) => ur.userId === userId);
    const myStatus = userRatingEntry?.userRating ?? 'None';

    const cleanedPost = omit(post, [
      '_id',
      '__v',
      'extendedLikesInfo.userRatings',
    ]);

    const topNewestLikes = newestLikes
      .filter((like) => like.userId !== userId)
      .map(({ addedAt, userId, login }) => ({ addedAt, userId, login }))
      .slice(0, 3);

    return {
      ...cleanedPost,
      extendedLikesInfo: {
        ...cleanedPost.extendedLikesInfo,
        newestLikes: topNewestLikes,
        myStatus,
      },
    };
  }

  async createPost(payload: PostType): Promise<PostType | string> {
    try {
      await this.postModel.create(payload);

      return { ...omit(payload, ['extendedLikesInfo.userRatings']) };
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
    }
  }

  async updatePost(payload: {
    id: string;
    body: UpdatePostDTO;
  }): Promise<boolean> {
    const {
      id,
      body: { blogId, content, shortDescription, title },
    } = payload;
    const post = await this.postModel.findOne({ id });

    if (!post) return false;

    post.blogId = blogId || post.blogId;
    post.content = content || post.content;
    post.shortDescription = shortDescription || post.shortDescription;
    post.title = title || post.title;

    post.save();

    return true;
  }

  async deletePost(id: string): Promise<boolean> {
    const { deletedCount } = await this.postModel.deleteOne({ id });

    return deletedCount === 1;
  }

  async updateLikeStatus(params: UpdateLikePostDto): Promise<boolean> {
    const { postId, userId, likeStatus, userLogin } = params;

    const post = await this.postModel.findOne({ id: postId });
    if (!post) return false;

    const likesInfo = post.extendedLikesInfo;
    const currentUser = likesInfo.userRatings?.find((u) => u.userId === userId);

    const removeFromNewestLikes = () => {
      likesInfo.newestLikes = likesInfo.newestLikes?.filter(
        (like) => like.userId !== userId,
      );
    };

    const addToNewestLikes = () => {
      likesInfo.newestLikes = [
        {
          addedAt: new Date().toISOString(),
          login: userLogin,
          userId,
        },
        ...(likesInfo.newestLikes ?? []),
      ];
    };

    const incrementLike = () => {
      likesInfo.likesCount++;
      addToNewestLikes();
    };

    const decrementLike = () => {
      likesInfo.likesCount = Math.max(0, likesInfo.likesCount - 1);
      removeFromNewestLikes();
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
          if (currentUser.userRating === 'Like') return true;
          if (currentUser.userRating === 'Dislike') decrementDislike();
          currentUser.userRating = 'Like';
        } else {
          likesInfo.userRatings!.push({ userId, userRating: 'Like' });
        }
        incrementLike();
        break;

      case 'Dislike':
        if (currentUser) {
          if (currentUser.userRating === 'Dislike') return true;
          if (currentUser.userRating === 'Like') decrementLike();
          currentUser.userRating = 'Dislike';
        } else {
          likesInfo.userRatings!.push({ userId, userRating: 'Dislike' });
        }
        incrementDislike();
        break;

      case 'None':
        if (!currentUser) return true;
        if (currentUser.userRating === 'Like') decrementLike();
        if (currentUser.userRating === 'Dislike') decrementDislike();
        currentUser.userRating = 'None';
        break;

      default:
        return false;
    }

    likesInfo.myStatus = likeStatus;
    await post.save();
    return true;
  }
}
