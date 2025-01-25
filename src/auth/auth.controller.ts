import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import { CurrentUserId } from './decorators';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { User } from 'src/types';

@Controller('/auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUserId() userId: User, @Res() response: Response) {
    const access_token = await this.jwtService.sign({ userId });

    return response.status(HttpStatus.OK).send({ access_token });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@CurrentUserId() userId) {
    return { id: userId };
  }
}
