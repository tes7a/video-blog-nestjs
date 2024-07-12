import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ required: true, type: String, maxlength: 15 })
  name: string;

  @Prop({ type: String })
  id: string;

  @Prop({ required: true, type: String, maxlength: 500 })
  description: string;

  @Prop({ required: true, type: String, maxlength: 100 })
  websiteUrl: string;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: Boolean })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
