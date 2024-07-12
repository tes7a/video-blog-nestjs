import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { map, pick } from 'lodash';

import { Blog } from '../../schemas';
import { GetBlogsDTO } from '../../dto';
import { CreateBlogOutput, GetBlogsOutput } from '../../types';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getAllBlogs(query: GetBlogsDTO): Promise<GetBlogsOutput | string> {
    const {
      searchNameTerm,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageSize = 10,
      pageNumber = 1,
    } = query;

    try {
      const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);

      const defaultSearchName = {
        name: { $regex: searchNameTerm ?? '', $options: 'i' },
      };

      const totalCount = await this.blogModel.countDocuments(defaultSearchName);

      const sortedBlogs = await this.blogModel
        .find(defaultSearchName, { projection: { _id: 0 } })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(startIndex)
        .limit(Number(pageSize))
        .lean();

      const pagesCount: number = Math.ceil(totalCount / Number(pageSize));
      const items: CreateBlogOutput[] = map(sortedBlogs, (blog) => ({
        ...pick(
          blog,
          'id',
          'name',
          'description',
          'websiteUrl',
          'createdAt',
          'isMembership',
        ),
      }));

      return {
        pagesCount,
        page: Number(pageNumber),
        pageSize: Number(pageSize),
        totalCount,
        items,
      };
    } catch (e) {
      if (e instanceof MongooseError) {
        return e.message;
      }
    }
  }
}
