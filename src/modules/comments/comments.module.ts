import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Comment, CommentSchema } from '../../schemas';
import { CommentsController } from './controllers/comments.controller';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsService } from './services/comments.service';
import { CommentsQueryRepository } from './infrastructure/query/comments-query.repository';

Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
  exports: [MongooseModule],
});
export class CommentsModule {}
