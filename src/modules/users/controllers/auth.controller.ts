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
import { SkipThrottle } from '@nestjs/throttler';

import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { CurrentUser, CurrentUserId } from '../decorators';
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

  @SkipThrottle()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUserId() tokens: Tokens, @Res() response: Response) {
    const { accessToken, refreshToken } = tokens;

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: this.userConfig.cookieTokenExpireIn,
    });

    return response.status(HttpStatus.OK).send({ accessToken });
  }

  @SkipThrottle()
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

  @Post('/password-recovery')
  async passwordRecover(
    @Body() body: EmailValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.passwordRecover(body.email);
    if (errors) throw new BadRequestException(errors);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

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

  @Post('/registration')
  async registerUser(
    @Body() body: RegistrationValidation,
    @Res() response: Response,
  ) {
    await this.authService.registerUser(body);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post('/registration-confirmation')
  async registrationConfirmation(
    @Body() body: CodeValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.confirmCode(body.code);
    if (errors) throw new BadRequestException(errors);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

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
