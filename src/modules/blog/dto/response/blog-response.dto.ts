import { ApiProperty } from '@nestjs/swagger';

export class BlogViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  websiteUrl: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isMembership: boolean;
}

export class BlogsPaginationDto {
  @ApiProperty()
  pagesCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [BlogViewDto] })
  items: BlogViewDto[];
}
