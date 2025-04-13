export interface CommentType {
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
    myStatus: 'None' | 'Like' | 'Dislike';
    userRatings?: {
      userId: string;
      userRating: string;
    }[];
  };
}

export type GetCommentOutputType = Omit<CommentType, 'postId' | 'userRatings'>;

export interface GetCommentsOutputType {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetCommentOutputType[];
}

export class Comment {
  constructor(public params: CommentType) {}
}
