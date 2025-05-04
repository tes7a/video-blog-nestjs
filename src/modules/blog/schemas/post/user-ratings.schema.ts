import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserRatings {
  @Prop()
  userId: string;

  @Prop()
  userRating: string;
}

export const UserRatingsSchema = SchemaFactory.createForClass(UserRatings);
