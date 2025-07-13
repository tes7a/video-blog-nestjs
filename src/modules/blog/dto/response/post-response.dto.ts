import { ApiProperty } from '@nestjs/swagger';

export class PostViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  blogId: string;

  @ApiProperty()
  blogName: string;

  @ApiProperty()
  createdAt: string;
}

export class PostsPaginationDto {
  @ApiProperty()
  pagesCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [PostViewDto] })
  items: PostViewDto[];
}
