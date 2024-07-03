export interface Post {
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
    newestLikes?: Array<NewestLikes>;
  };
}

export interface NewestLikes {
  addedAt: string;
  userId: string;
  login: string;
}

export interface UserRatings {
  userId: string;
  userRating: string;
}
