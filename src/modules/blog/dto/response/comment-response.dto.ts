import { ApiProperty } from '@nestjs/swagger';

export class CommentViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ example: { userId: 'string', userLogin: 'string' } })
  commentatorInfo: { userId: string; userLogin: string };

  @ApiProperty({
    example: { likesCount: 0, dislikesCount: 0, myStatus: 'None' },
  })
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
}

export class CommentsPaginationDto {
  @ApiProperty()
  pagesCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [CommentViewDto] })
  items: CommentViewDto[];
}
