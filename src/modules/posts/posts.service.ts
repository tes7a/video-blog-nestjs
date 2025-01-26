import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { PostsRepository } from './posts.repository';
import { BlogsRepository } from 'src/modules/blogs/blogs.repository';
import { CreatePostDTO, UpdatePostDTO } from 'src/dto';
import { PostDBModel } from 'src/models';
import { Post } from 'src/types';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogRepository: BlogsRepository,
  ) {}

  async getPostById(id: string): Promise<Post | undefined> {
    return await this.postsRepository.getPostById(id);
  }

  async createPost(payload: CreatePostDTO): Promise<Post | undefined | string> {
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

  async updatePost(payload: {
    id: string;
    body: UpdatePostDTO;
  }): Promise<boolean> {
    return await this.postsRepository.updatePost(payload);
  }

  async deletePost(id: string): Promise<boolean> {
    return await this.postsRepository.deletePost(id);
  }
}
