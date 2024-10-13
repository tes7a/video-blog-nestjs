import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { CurrentUserId } from './decorators';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUserId() user: number) {
    //TODO: implement logic for extract user end return JWT
    return { access_token: this.jwtService.sign(user) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@CurrentUserId() userId) {
    return { id: userId };
  }
}
