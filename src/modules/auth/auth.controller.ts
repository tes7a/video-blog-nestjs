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

import { CurrentUser, CurrentUserId } from './decorators';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { User } from 'src/types';

@Controller('/auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUserId() userId: User['id'], @Res() response: Response) {
    const access_token = await this.jwtService.sign({ userId });

    return response.status(HttpStatus.OK).send({ access_token });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(
    @CurrentUser()
    accountData: Pick<User, 'id'> &
      Pick<User['accountData'], 'email' | 'login'>,
    @Res() response: Response,
  ) {
    return response.status(HttpStatus.OK).send(accountData);
  }
}
