import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts-query.repository';
import { Blog, BlogSchema, Comment, Post, PostSchema } from 'src/schemas';
import { BlogsRepository } from 'src/modules/blogs/blogs.repository';
import { CommentatorInfoSchema } from 'src/schemas/comment/commentator-info.schema';
import { CommentsQueryRepository } from '../comments/comments-query.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentatorInfoSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsRepository,
    CommentsQueryRepository,
  ],
  exports: [MongooseModule],
})
export class PostsModule {}
