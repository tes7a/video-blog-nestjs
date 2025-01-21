import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { Post } from '../schemas';
import { Post as PostType } from '../types';
import { UpdatePostDTO } from '../dto';

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
}
