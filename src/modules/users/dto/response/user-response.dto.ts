import { ApiProperty } from '@nestjs/swagger';

export class UserViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: string;
}

export class UsersPaginationDto {
  @ApiProperty()
  pagesCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [UserViewDto] })
  items: UserViewDto[];
}

export class CreateUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: string;
}
