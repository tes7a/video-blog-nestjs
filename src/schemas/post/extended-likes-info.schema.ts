import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { NewestLikes } from './newest-likes.schema';
import { UserRatings, UserRatingsSchema } from './user-ratings.schema';

@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;

  @Prop()
  myStatus: string;

  @Prop()
  newestLikes: Array<NewestLikes>;

  @Prop({ type: UserRatingsSchema })
  userRatings: Array<UserRatings>;
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);
