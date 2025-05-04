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

  @Prop({ type: [UserRatingsSchema], _id: false, default: [] })
  userRatings?: Array<UserRatings>;
}

export const CommentExtendedLikesInfoSchema = SchemaFactory.createForClass(
  CommentExtendedLikesInfo,
);
