import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersConfig } from '../config/users.config';
import { UserType } from '../models';
import { DeviceRepository, UsersRepository } from '../infrastructure';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersRepository: UsersRepository,
    private deviceRepository: DeviceRepository,
    userConfig: UsersConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userConfig.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload<UserType>): Promise<
    Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'> & {
        deviceId: string;
      }
  > {
    const {
      user: { id: userId },
      deviceId,
    } = payload;

    const user = await this.usersRepository.findUserById(userId);
    const device = await this.deviceRepository.getDevice(deviceId);

    if (!device) {
      throw new UnauthorizedException('Invalid device credentials');
    }

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please check your credentials.',
      );
    }

    return {
      id: user.id,
      email: user.accountData.email,
      login: user.accountData.login,
      deviceId,
    };
  }
}
