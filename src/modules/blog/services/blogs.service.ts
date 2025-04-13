import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { BlogsRepository } from '../infrastructure';
import { CreateBlogDTO } from '../dto';
import { BlogDBModel, BlogType } from '../models';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(payload: CreateBlogDTO): Promise<BlogType | string> {
    const { description, name, websiteUrl } = payload;
    const { params } = new BlogDBModel({
      id: v4(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });

    return await this.blogsRepository.createBlog(params);
  }
}
