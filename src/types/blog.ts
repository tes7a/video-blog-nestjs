export interface CreateBlogOutput {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface GetBlogsOutput {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CreateBlogOutput[];
}
