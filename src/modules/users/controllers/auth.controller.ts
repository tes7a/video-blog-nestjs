import { Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import {
  JwtAuthGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
  LoginDeviceGuard,
} from '../guards';
import { CurrentUser, Tokens } from '../decorators';
import { AuthService } from '../services';
import {
  CodeValidation,
  EmailValidation,
  PasswordValidation,
  RegistrationValidation,
} from '../validation';
import { UserType } from '../models';
import { UsersConfig } from '../config/users.config';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userConfig: UsersConfig,
  ) {}

  @UseGuards(LocalAuthGuard, LoginDeviceGuard)
  @Post('/login')
  async login(@Tokens() tokens: Tokens, @Res() response: Response) {
    const { accessToken, refreshToken } = tokens;

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: this.userConfig.cookieTokenExpireIn,
    });

    return response.status(HttpStatus.OK).send({ accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Res() response: Response,
  ) {
    return response.status(HttpStatus.OK).send(accountData);
  }

  @Throttle({ default: { limit: 5, ttl: 5000 } })
  @Post('/password-recovery')
  async passwordRecover(
    @Body() body: EmailValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.passwordRecover(body.email);
    if (errors) throw new BadRequestException(errors);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Throttle({ default: { limit: 5, ttl: 5000 } })
  @Post('/new-password')
  async newPassword(
    @Body() body: PasswordValidation,
    @Res() response: Response,
  ) {
    const { newPassword, recoveryCode } = body;
    const errors = await this.authService.setPassword(
      recoveryCode,
      newPassword,
    );
    if (errors) throw new BadRequestException(errors);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Throttle({ default: { limit: 5, ttl: 5000 } })
  @Post('/registration')
  async registerUser(
    @Body() body: RegistrationValidation,
    @Res() response: Response,
  ) {
    await this.authService.registerUser(body);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Throttle({ default: { limit: 5, ttl: 5000 } })
  @Post('/registration-confirmation')
  async registrationConfirmation(
    @Body() body: CodeValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.confirmCode(body.code);
    if (errors) throw new BadRequestException(errors);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/refresh-token')
  async refreshToken(
    @Tokens() tokens: Tokens,
    @Res() response: Response,
  ) {
    const { accessToken, refreshToken } = tokens;

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: this.userConfig.cookieTokenExpireIn,
    });

    return response.status(HttpStatus.OK).send({ accessToken });
  }

  @Throttle({ default: { limit: 5, ttl: 5000 } })
  @Post('/registration-email-resending')
  async registrationResending(
    @Body() body: EmailValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.resendingEmail(body.email);
    if (errors) throw new BadRequestException(errors);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
