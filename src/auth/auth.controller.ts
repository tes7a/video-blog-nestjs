import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CurrentUserId } from './decorators';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { User } from 'src/types';

@Controller('/auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUserId() user: User) {
    //TODO: implement logic for extract user end return JWT
    const payload = { sub: user.id, username: user.accountData.login };
    return { access_token: this.jwtService.sign(payload) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@CurrentUserId() userId) {
    return { id: userId };
  }
}
