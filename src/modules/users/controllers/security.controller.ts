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
import { JwtAuthGuard } from '../guards';
import { CurrentUser } from '../decorators';
import { UserType } from '../models';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('/security')
export class SecurityController {
  constructor(private deviceRepository: DeviceRepository) {}

  @Get('/devices')
  async getAllDevices(
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
  ) {
    const devices = await this.deviceRepository.getAllDevices(accountData.id);
    return devices;
  }

  @Delete('/devices')
  async deleteAllDevices(
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'> & { deviceId: string },
    @Res() response: Response,
  ) {
    await this.deviceRepository.deleteAllDevices(
      accountData.id,
      accountData.deviceId,
    );
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete('/devices/:deviceId')
  async deleteCurrentDevice(
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Param('deviceId') deviceId: string,
    @Res() response: Response,
  ) {
    await this.deviceRepository.deleteCurrentDevice(accountData.id, deviceId);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
