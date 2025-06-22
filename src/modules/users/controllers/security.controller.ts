import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DeviceRepository } from '../infrastructure';
import { JwtRefreshGuard } from '../guards';
import { Tokens } from '../decorators';
import { Response } from 'express';

@UseGuards(JwtRefreshGuard)
@Controller('/security')
export class SecurityController {
  constructor(private deviceRepository: DeviceRepository) {}

  @Get('/devices')
  async getAllDevices(
    @Tokens()
    data: Tokens & { userId: string; deviceId: string },
  ) {
    const devices = await this.deviceRepository.getAllDevices(data.userId);
    return devices;
  }

  @Delete('/devices')
  async deleteAllDevices(
    @Tokens() data: Tokens & { userId: string; deviceId: string },
    @Res() response: Response,
  ) {
    await this.deviceRepository.deleteAllDevices(data.userId, data.deviceId);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete('/devices/:deviceId')
  async deleteCurrentDevice(
    @Tokens() data: Tokens & { userId: string; deviceId: string },
    @Param('deviceId') deviceId: string,
    @Res() response: Response,
  ) {
    if (!deviceId) return response.sendStatus(HttpStatus.NOT_FOUND);
    await this.deviceRepository.deleteCurrentDevice(data.userId, deviceId);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
