import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserRatings, UserRatingsSchema } from '../post/user-ratings.schema';

export class CommentExtendedLikesInfo {
  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;

  @Prop()
  myStatus: string;

  @Prop({ type: UserRatingsSchema })
  userRatings?: Array<UserRatings>;
}

export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(
  CommentExtendedLikesInfo,
);
