import { Request, Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  LoginValidation,
  PasswordValidation,
  RegistrationValidation,
} from '../validation';
import { UserType } from '../models';
import { UsersConfig } from '../config/users.config';
import { DeviceRepository, SecurityRepository } from '../infrastructure';
import { AccessTokenDto, ProfileDto } from '../dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userConfig: UsersConfig,
    private deviceRepository: DeviceRepository,
    private securityRepository: SecurityRepository,
  ) {}

  @UseGuards(LocalAuthGuard, LoginDeviceGuard)
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginValidation })
  @ApiResponse({
    status: 200,
    description: 'Login success',
    type: AccessTokenDto,
  })
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

  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 204, description: 'Logout success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Tokens() data: Tokens & { userId: string; deviceId: string },
    @Res() response: Response,
  ) {
    const { refreshToken } = req.cookies;

    const isTokenBlacklisted =
      await this.securityRepository.isTokenBlacklisted(refreshToken);

    if (!refreshToken || isTokenBlacklisted)
      return response.sendStatus(HttpStatus.UNAUTHORIZED);

    await this.securityRepository.addInvalidToken(refreshToken);
    await this.deviceRepository.deleteCurrentDevice(data.userId, data.deviceId);
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile data', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/me')
  getProfile(
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Res() response: Response,
  ) {
    return response.status(HttpStatus.OK).send({
      email: accountData.email,
      login: accountData.login,
      userId: accountData.id,
    });
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @ApiOperation({ summary: 'Send password recovery email' })
  @ApiBody({ type: EmailValidation })
  @ApiResponse({ status: 204, description: 'Email sent' })
  @Post('/password-recovery')
  async passwordRecover(
    @Body() body: EmailValidation,
    @Res() response: Response,
  ) {
    const errors = await this.authService.passwordRecover(body.email);
    if (errors) throw new BadRequestException(errors);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @ApiOperation({ summary: 'Set new password' })
  @ApiBody({ type: PasswordValidation })
  @ApiResponse({ status: 204, description: 'Password set' })
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

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: RegistrationValidation })
  @ApiResponse({ status: 204, description: 'Registration success' })
  @Post('/registration')
  async registerUser(
    @Body() body: RegistrationValidation,
    @Res() response: Response,
  ) {
    await this.authService.registerUser(body);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @ApiOperation({ summary: 'Confirm registration' })
  @ApiBody({ type: CodeValidation })
  @ApiResponse({ status: 204, description: 'Confirmation success' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh auth tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    type: AccessTokenDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/refresh-token')
  async refreshToken(
    @Tokens() data: Tokens & { userId: string; deviceId: string },
    @Req() req: Request,
    @Res() response: Response,
  ) {
    const oldRefreshToken = req.cookies?.refreshToken;
    const isTokenBlacklisted =
      await this.securityRepository.isTokenBlacklisted(oldRefreshToken);

    if (!oldRefreshToken || isTokenBlacklisted)
      return response.sendStatus(HttpStatus.UNAUTHORIZED);

    await this.securityRepository.addInvalidToken(oldRefreshToken);

    await this.deviceRepository.updateDeviceActivity(
      data.deviceId,
      new Date().toISOString(),
    );

    const { accessToken, refreshToken } = data;

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: this.userConfig.cookieTokenExpireIn,
    });

    return response.status(HttpStatus.OK).send({ accessToken });
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @ApiOperation({ summary: 'Resend confirmation email' })
  @ApiBody({ type: EmailValidation })
  @ApiResponse({ status: 204, description: 'Email resent' })
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
