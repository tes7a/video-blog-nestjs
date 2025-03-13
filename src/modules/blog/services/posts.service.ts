import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { BlogsRepository, PostsRepository } from '../infrastructure';
import { CreatePostDTO } from '../dto';
import { PostDBModel, PostType } from '../models';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogRepository: BlogsRepository,
  ) {}

  async createPost(
    payload: CreatePostDTO,
  ): Promise<PostType | undefined | string> {
    const { blogId, content, shortDescription, title } = payload;
    const blog = await this.blogRepository.getBlogById(blogId);

    if (!blog) return undefined;

    const { params } = new PostDBModel({
      id: v4(),
      blogId,
      blogName: blog.name,
      content,
      shortDescription,
      title,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });

    return await this.postsRepository.createPost(params);
  }
}
