import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  AuthModule,
  BlogsModule,
  CommentsModule,
  PostsModule,
  UsersModule,
} from './modules';
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
