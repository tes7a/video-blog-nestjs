import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
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

import { JwtAuthGuard, LocalAuthGuard } from '../guards';

import { User } from '../../../types';
import { CurrentUser, CurrentUserId } from '../decorators';
import { AuthService } from '../services/auth.service';
import { EmailValidation } from '../validation/email.validation';
import { PasswordValidation } from '../validation/password.validation';
import { RegistrationValidation } from '../validation/registration.validation';
import { CodeValidation } from '../validation/code.validation';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@CurrentUserId() accessToken: string, @Res() response: Response) {
    return response.status(HttpStatus.OK).send({ accessToken });
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
