import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUserId } from './decorators';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('/auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUserId() userId: number) {
    //TODO: implement logic for extract user end return JWT
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@CurrentUserId() userId) {
    return { id: userId };
  }
}
