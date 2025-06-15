import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { DeviceRepository } from '../infrastructure';
import { Request } from 'express';

@Injectable()
export class LoginDeviceGuard implements CanActivate {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const userId = req.user.id;
    const deviceId = req.user.deviceId;

    if (!userId) return true;

    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket?.remoteAddress ||
      'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    await this.deviceRepository.logDevice({
      userId,
      deviceId,
      title: userAgent,
      ip: Array.isArray(ip) ? ip[0] : ip,
      lastActiveDate: new Date().toISOString(),
    });

    return true;
  }
}
