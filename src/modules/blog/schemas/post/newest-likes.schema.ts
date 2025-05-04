import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class NewestLikes {
  @Prop()
  addedAt: string;

  @Prop()
  userId: string;

  @Prop()
  login: string;
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);
