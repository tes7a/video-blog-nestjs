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

  async getPostById(id: string): Promise<PostType | undefined> {
    const post = await this.postModel.findOne({ id }).lean();

    if (!post) return undefined;

    return { ...omit(post, ['_id', '__v']) };
  }

  async createPost(payload: PostType): Promise<PostType | string> {
    try {
      await this.postModel.create(payload);
      return payload;
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
