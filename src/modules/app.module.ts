import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlogsController,
  CommentsController,
  PostsController,
  ResetController,
  UsersController,
} from '../controllers';
import {
  BlogsRepository,
  UsersRepository,
  PostsRepository,
  CommentsRepository,
  BlogsQueryRepository,
  UsersQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
} from '../repository';
import {
  Blog,
  BlogSchema,
  Comment,
  CommentSchema,
  Post,
  PostSchema,
  User,
  UserSchema,
} from '../schemas';
import {
  BlogsService,
  CommentsService,
  PostsService,
  UsersService,
} from '../services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
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
