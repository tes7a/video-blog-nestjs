import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { BlogsRepository } from 'src/repository';
import { BlogDBModel } from 'src/models';
import { CreateBlogDTO, UpdateBlogDTO } from 'src/dto';
import { CreateBlogOutput } from 'src/types';

@Injectable()
export class BlogService {
  constructor(private blogRepository: BlogsRepository) {}

  async getBlogById(id: string): Promise<CreateBlogOutput | undefined> {
    return await this.blogRepository.getBlogById(id);
  }

  async createBlog(payload: CreateBlogDTO): Promise<CreateBlogOutput | string> {
    const { description, name, websiteUrl } = payload;
    const { params } = new BlogDBModel({
      id: v4(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: true,
    });

    return await this.blogRepository.createBlog(params);
  }

  async updateBlog(payload: {
    id: string;
    data: UpdateBlogDTO;
  }): Promise<boolean> {
    return await this.blogRepository.updateBlog(payload);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogRepository.deleteBlog(id);
  }
}
