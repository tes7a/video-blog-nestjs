import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlogsController,
  PostsController,
  ResetController,
  UsersController,
} from 'src/controllers';
import {
  BlogsRepository,
  UsersRepository,
  PostsRepository,
  BlogsQueryRepository,
  UsersQueryRepository,
  PostsQueryRepository,
} from 'src/repository';
import {
  Blog,
  BlogSchema,
  Post,
  PostSchema,
  User,
  UserSchema,
} from 'src/schemas';
import { BlogService, PostsService, UsersService } from 'src/services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [
    UsersController,
    ResetController,
    BlogsController,
    PostsController,
  ],
  providers: [
    UsersService,
    BlogService,
    PostsService,
    UsersRepository,
    BlogsRepository,
    PostsRepository,
    UsersQueryRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
  ],
})
export class AppModule {}
