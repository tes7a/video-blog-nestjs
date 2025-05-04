import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  CommentatorInfo,
  CommentatorInfoSchema,
} from './commentator-info.schema';
import {
  CommentExtendedLikesInfo,
  CommentExtendedLikesInfoSchema,
} from './comment-extendedLikesInfo';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  name: string;

  @Prop()
  id: string;

  @Prop()
  postId: string;

  @Prop()
  content: string;

  @Prop()
  createdAt: string;

  @Prop({ type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: CommentExtendedLikesInfoSchema })
  likesInfo: CommentExtendedLikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
