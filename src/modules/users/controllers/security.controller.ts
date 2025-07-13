import { Response } from 'express';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DeviceRepository } from '../infrastructure';
import { JwtRefreshGuard } from '../guards';
import { Tokens } from '../decorators';
import { DeviceViewDto } from '../dto';

@UseGuards(JwtRefreshGuard)
@ApiTags('Security')
@Controller('/security')
export class SecurityController {
  constructor(private deviceRepository: DeviceRepository) {}

  @Get('/devices')
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({
    status: 200,
    description: 'List of devices',
    type: [DeviceViewDto],
  })
  async getAllDevices(
    @Tokens()
    data: Tokens & { userId: string; deviceId: string },
  ) {
    const devices = await this.deviceRepository.getAllDevices(data.userId);
    return devices;
  }

  @Delete('/devices')
  @ApiOperation({ summary: 'Delete all devices except current' })
  @ApiResponse({ status: 204, description: 'Devices deleted' })
  async deleteAllDevices(
    @Tokens() data: Tokens & { userId: string; deviceId: string },
    @Res() response: Response,
  ) {
    await this.deviceRepository.deleteAllDevices(data.userId, data.deviceId);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete('/devices/:deviceId')
  @ApiOperation({ summary: 'Delete current device' })
  @ApiParam({ name: 'deviceId', description: 'Device id' })
  @ApiResponse({ status: 204, description: 'Device deleted' })
  async deleteCurrentDevice(
    @Tokens() data: Tokens & { userId: string; deviceId: string },
    @Param('deviceId') deviceId: string,
    @Res() response: Response,
  ) {
    await this.deviceRepository.deleteCurrentDevice(data.userId, deviceId);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
