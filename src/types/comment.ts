export interface Comment {
  id: string;
  postId: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: null | string;
    userRatings?: {
      userId: string;
      userRating: string;
    }[];
  };
}

export type GetCommentOutput = Omit<Comment, 'postId' | 'userRatings'>;
