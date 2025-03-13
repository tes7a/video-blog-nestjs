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
import { BlogsService, CommentsService, PostsService } from './services';
import {
  BlogsQueryRepository,
  BlogsRepository,
  CommentsQueryRepository,
  CommentsRepository,
  PostsQueryRepository,
  PostsRepository,
} from './infrastructure';

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
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
  ],
  exports: [MongooseModule],
})
export class BlogModule {}
