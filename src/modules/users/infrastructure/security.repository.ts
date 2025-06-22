import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { InvalidToken } from '../schemas';
import { UsersConfig } from '../config/users.config';

@Injectable()
export class SecurityRepository {
  constructor(
    @InjectModel(InvalidToken.name)
    private invalidTokenModel: Model<InvalidToken>,
    private usersConfig: UsersConfig,
  ) {}

  async addInvalidToken(token: string) {
    const ttlMs = this.parseTTL(this.usersConfig.refreshTokenExpireIn);
    await this.invalidTokenModel.create({
      token,
      expiresAt: new Date(Date.now() + ttlMs),
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return !!(await this.invalidTokenModel.exists({ token }));
  }

  private parseTTL(value: string | number): number {
    if (typeof value === 'number') return value;

    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) return 0;

    const num = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return num * 1000;
      case 'm':
        return num * 60 * 1000;
      case 'h':
        return num * 60 * 60 * 1000;
      case 'd':
        return num * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }
}
