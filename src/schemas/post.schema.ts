import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  ExtendedLikesInfo,
  ExtendedLikesInfoSchema,
} from './extended-likes-info.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop()
  name: string;

  @Prop()
  id: string;

  @Prop({ required: true, type: String, maxlength: 30 })
  title: string;

  @Prop({ required: true, type: String, maxlength: 100 })
  shortDescription: string;

  @Prop({ required: true, type: String, maxlength: 1000 })
  content: string;

  @Prop({ required: true, type: String })
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: string;

  @Prop({ type: ExtendedLikesInfoSchema })
  extendedLikesInfo: ExtendedLikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);
