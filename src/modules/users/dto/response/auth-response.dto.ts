import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty()
  accessToken: string;
}

export class ProfileDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  userId: string;
}
