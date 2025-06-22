import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { omit } from 'lodash';

import { Device, DeviceDocument } from '../schemas';
import { DeviceType } from '../models';
import { DeviceDto } from '../dto';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}
  async logDevice(deviceInfo: DeviceDto): Promise<void> {
    await this.deviceModel.create(deviceInfo);
  }

  async getDevice(deviceId: string): Promise<DeviceType> {
    const device = await this.deviceModel
      .findOne({ deviceId })
      .lean<DeviceType>()
      .exec();

    return device;
  }

  async getAllDevices(userId: string): Promise<DeviceType[]> {
    const devices = await this.deviceModel
      .find({
        userId: { $regex: userId },
      })
      .lean<DeviceType[]>()
      .exec();

    return devices.map((device) => omit(device, ['_id', '__v', 'userId']));
  }

  async deleteAllDevices(userId: string, deviceId: string): Promise<void> {
    try {
      await this.deviceModel.deleteMany({
        $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
      });
    } catch (e) {
      switch (e) {
        case e instanceof MongooseError:
        case e instanceof Error:
        case 'field' in e:
          throw new BadRequestException('Unknown error occurred: ' + e.message);
        default:
          throw new BadRequestException('Unknown error occurred');
      }
    }
  }

  async updateDeviceActivity(
    deviceId: string,
    lastActiveDate: string,
  ): Promise<void> {
    await this.deviceModel.updateOne(
      { deviceId },
      { $set: { lastActiveDate } },
    );
  }

  async deleteCurrentDevice(userId: string, deviceId: string): Promise<void> {
    try {
      const device = await this.deviceModel.findOne({ deviceId });

      if (!device) {
        throw new NotFoundException('Device not found');
      }

      if (device.userId.toString() !== userId.toString()) {
        throw new ForbiddenException(
          'You are not allowed to delete this device',
        );
      }

      await this.deviceModel.deleteOne({
        $and: [{ userId: userId }, { deviceId: deviceId }],
      });
    } catch (e) {
      if (e instanceof MongooseError || !(e instanceof HttpException)) {
        throw new BadRequestException(
          'Unexpected error: ' + (e as Error).message,
        );
      }

      throw e;
    }
  }
}
