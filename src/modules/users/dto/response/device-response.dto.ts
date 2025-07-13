import { ApiProperty } from '@nestjs/swagger';

export class DeviceViewDto {
  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  ip: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  lastActiveDate: string;
}
