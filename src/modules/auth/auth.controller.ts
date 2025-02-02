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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser, CurrentUserId } from './decorators';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import {
  CodeValidation,
  EmailValidation,
  PasswordValidation,
  RegistrationValidation,
} from './validation';
import { User } from 'src/types';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

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

  @Post('/password-recovery')
  async passwordRecover(
    @Body() body: EmailValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.passwordRecover(body.email);
    if (errors) throw new BadRequestException(errors);
    return response.send(HttpStatus.NO_CONTENT);
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
    return response.send(HttpStatus.NO_CONTENT);
  }

  @Post('/registration')
  async registerUser(
    @Body() body: RegistrationValidation,
    @Res() response: Response,
  ) {
    await this.authService.registerUser(body);
    return response.send(HttpStatus.NO_CONTENT);
  }

  @Post('/registration-confirmation')
  async registrationConfirmation(
    @Body() body: CodeValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.confirmCode(body.code);
    if (errors) throw new BadRequestException(errors);
    return response.send(HttpStatus.NO_CONTENT);
  }

  @Post('/registration-email-resending')
  async registrationResending(
    @Body() body: EmailValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.resendingEmail(body.email);
    if (errors) throw new BadRequestException(errors);
    return response.send(HttpStatus.NO_CONTENT);
  }
}
