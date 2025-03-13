import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { Blog } from '../../schemas';
import { GetBlogsDTO } from '../../dto';
import { BlogType, GetBlogsOutputType } from '../../models';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getAllBlogs(query: GetBlogsDTO): Promise<GetBlogsOutputType | string> {
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
      const items: BlogType[] = sortedBlogs.map((blog) => ({
        ...omit(blog, ['_id', '__v']),
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
