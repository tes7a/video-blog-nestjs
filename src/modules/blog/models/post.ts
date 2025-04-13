export interface PostType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    userRatings?: Array<{
      userId: string;
      userRating: string;
    }>;
    newestLikes?: Array<NewestLikesType>;
  };
}



export interface NewestLikesType {
  addedAt: string;
  userId: string;
  login: string;
}

export interface UserRatingsType {
  userId: string;
  userRating: string;
}

export class PostDBModel {
  constructor(public params: PostType) {}
}
