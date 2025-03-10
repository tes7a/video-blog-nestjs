import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Blog, BlogSchema, Post, PostSchema } from '../../schemas';
import { BlogsController } from './controllers/blogs.controller';
import { BlogsService } from './services/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/query/blogs-query.repository';
import { PostsService } from '../posts/services/posts.service';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { PostsQueryRepository } from '../posts/infrastructure/query/posts-query.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
  ],
  exports: [MongooseModule],
})
export class BlogsModule {}
