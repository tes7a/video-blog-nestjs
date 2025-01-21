import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Blog, BlogSchema, Post, PostSchema } from 'src/schemas';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs-query.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { PostsService } from 'src/posts/posts.service';
import { PostsQueryRepository } from 'src/posts/posts-query.repository';

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
