import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { pick } from 'lodash';

import { BlogDBModel } from 'src/models';
import { Blog } from 'src/schemas';
import { CreateBlogOutput } from 'src/types';
import { UpdateBlogDTO } from 'src/dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getBlogById(id: string): Promise<CreateBlogOutput | undefined> {
    const data = await this.blogModel.findOne({ id });

    if (!data) return undefined;

    return {
      ...pick(
        data,
        'id',
        'name',
        'description',
        'websiteUrl',
        'createdAt',
        'isMembership',
      ),
    };
  }

  async createBlog(blogData: BlogDBModel): Promise<CreateBlogOutput | string> {
    try {
      await this.blogModel.create(blogData);
      return blogData;
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
    }
  }

  async updateBlog(payload: {
    id: string;
    data: UpdateBlogDTO;
  }): Promise<boolean> {
    const {
      id,
      data: { description, name, websiteUrl },
    } = payload;

    const blog = await this.blogModel.findOne({ id });

    if (!blog) return false;

    blog.name = name || blog.name;
    blog.description = description || blog.description;
    blog.websiteUrl = websiteUrl || blog.websiteUrl;

    await blog.save();

    return true;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const { deletedCount } = await this.blogModel.deleteOne({ id });

    return deletedCount === 1;
  }
}
