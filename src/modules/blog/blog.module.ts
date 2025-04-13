import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Blog,
  BlogSchema,
  Comment,
  CommentSchema,
  Post,
  PostSchema,
} from './schemas';
import {
  BlogsController,
  CommentsController,
  PostsController,
} from './controllers';
import { BlogsService, PostsService } from './services';
import {
  BlogsQueryRepository,
  BlogsRepository,
  CommentsQueryRepository,
  CommentsRepository,
  PostsQueryRepository,
  PostsRepository,
} from './infrastructure';
import { BasicAuthGuard, JwtAuthGuard } from '../users/guards';
import { UsersConfig } from '../users/config/users.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [BlogsController, CommentsController, PostsController],
  providers: [
    BasicAuthGuard,
    JwtAuthGuard,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    UsersConfig,
  ],
  exports: [MongooseModule],
})
export class BlogModule {}
