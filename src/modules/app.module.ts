import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlogsController,
  ResetController,
  UsersController,
} from 'src/controllers';
import {
  BlogsRepository,
  UsersRepository,
  BlogsQueryRepository,
  UsersQueryRepository,
} from 'src/repository';
import { Blog, BlogSchema, User, UserSchema } from 'src/schemas';
import { BlogService, UsersService } from 'src/services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [UsersController, ResetController, BlogsController],
  providers: [
    UsersService,
    UsersRepository,
    BlogService,
    BlogsRepository,
    UsersQueryRepository,
    BlogsQueryRepository,
  ],
})
export class AppModule {}
