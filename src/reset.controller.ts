import { Controller, Delete, HttpStatus, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';

import { Blog, Post, User } from './schemas';

@Controller('/testing')
export class ResetController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Post.name) private commentModel: Model<Comment>,
  ) {}

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
