export interface BlogType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface GetBlogsOutputType {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogType[];
}

export class BlogDBModel {
  constructor(public params: BlogType) {}
}
