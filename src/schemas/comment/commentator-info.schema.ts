import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CommentatorInfo {
  @Prop()
  userId: string;

  @Prop()
  userLogin: string;
}

export const CommentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);
