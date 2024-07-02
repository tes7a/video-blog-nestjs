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
    const blogData = new BlogDBModel(
      v4(),
      name,
      description,
      websiteUrl,
      new Date().toISOString(),
      true,
    );

    return await this.blogRepository.createBlog(blogData);
  }

  async updateBlog(payload: {
    id: string;
    data: UpdateBlogDTO;
  }): Promise<boolean> {
    return await this.blogRepository.updateBlog(payload);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogRepository.deleteBlog(id)
  }
}
