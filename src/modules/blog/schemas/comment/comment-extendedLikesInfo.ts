import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRatings, UserRatingsSchema } from '../post/user-ratings.schema';

@Schema()
export class CommentExtendedLikesInfo {
  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;

  @Prop()
  myStatus: 'None' | 'Like' | 'Dislike';

  @Prop({ type: UserRatingsSchema })
  userRatings?: Array<UserRatings>;
}

export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(
  CommentExtendedLikesInfo,
);
