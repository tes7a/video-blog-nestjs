import { Controller, Delete, HttpStatus, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';

import { User } from './modules/users/schemas';
import { Blog, Comment, Post } from './modules/blog/schemas';

@ApiTags('Testing')
@Controller('/testing')
export class ResetController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  @ApiOperation({ summary: 'Delete all data' })
  @ApiResponse({ status: 204, description: 'All data deleted' })
  @Delete('/all-data')
  async resetAllData(@Res() response: Response) {
    await Promise.all([
      this.userModel.deleteMany({}),
      this.blogModel.deleteMany({}),
      this.postModel.deleteMany({}),
      this.commentModel.deleteMany({}),
    ]);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
