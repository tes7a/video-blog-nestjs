import { IsEnum } from 'class-validator';

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export class LikeStatusValidation {
  @IsEnum(LikeStatus)
  likeStatus: 'Like' | 'Dislike' | 'None';
}
