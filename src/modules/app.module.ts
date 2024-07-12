import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlogsController,
  CommentsController,
  PostsController,
  ResetController,
  UsersController,
} from 'src/controllers';
import {
  BlogsRepository,
  UsersRepository,
  PostsRepository,
  CommentsRepository,
  BlogsQueryRepository,
  UsersQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
} from 'src/repository';
import {
  Blog,
  BlogSchema,
  Comment,
  CommentSchema,
  Post,
  PostSchema,
  User,
  UserSchema,
} from 'src/schemas';
import {
  BlogsService,
  CommentsService,
  PostsService,
  UsersService,
} from 'src/services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL || `mongodb://0.0.0.0:27017`),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [
    UsersController,
    ResetController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    UsersService,
    BlogsService,
    PostsService,
    CommentsService,
    UsersRepository,
    BlogsRepository,
    PostsRepository,
    CommentsRepository,
    UsersQueryRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
  ],
})
export class AppModule {}
