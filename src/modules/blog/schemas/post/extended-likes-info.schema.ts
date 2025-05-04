import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { NewestLikes, NewestLikesSchema } from './newest-likes.schema';
import { UserRatings, UserRatingsSchema } from './user-ratings.schema';

@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;

  @Prop({ type: String, default: 'None' })
  myStatus: string;

  @Prop({ type: [NewestLikesSchema], default: [], _id: false })
  newestLikes: Array<NewestLikes>;

  @Prop({ type: [UserRatingsSchema], default: [], _id: false })
  userRatings: Array<UserRatings>;
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);
