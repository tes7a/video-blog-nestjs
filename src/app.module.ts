import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth';
import { UsersModule } from 'src/users';
import { BlogsModule } from 'src/blogs';
import { PostsModule } from 'src/posts';
import { CommentsModule } from './comments';
import { ResetController } from './reset.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [ResetController],
})
export class AppModule {}
