import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';

import {
  BasicAuthGuard,
  JwtAuthGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
  LoginDeviceGuard,
  OptionalJwtAuthGuard,
} from './guards';
import {
  BasicStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategies';
import { UsersConfig } from './config/users.config';
import {
  Device,
  DeviceSchema,
  InvalidToken,
  InvalidTokenSchema,
  User,
  UserSchema,
} from './schemas';
import {
  AuthController,
  SecurityController,
  UsersController,
} from './controllers';
import { AuthService, UsersService } from './services';
import {
  DeviceRepository,
  SecurityRepository,
  UsersQueryRepository,
  UsersRepository,
} from './infrastructure';
import { EmailManager } from './managers';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt-refresh' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: InvalidToken.name, schema: InvalidTokenSchema },
    ]),
    JwtModule,
  ],
  controllers: [UsersController, AuthController, SecurityController],
  providers: [
    BasicAuthGuard,
    BasicStrategy,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersConfig,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    LoginDeviceGuard,
    DeviceRepository,
    SecurityRepository,
    EmailManager,
    JwtRefreshGuard,
    JwtRefreshStrategy,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UsersConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.accessTokenSecret,
          signOptions: { expiresIn: userAccountConfig.accessTokenExpireIn },
        });
      },
      inject: [UsersConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UsersConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.refreshTokenSecret,
          signOptions: { expiresIn: userAccountConfig.refreshTokenExpireIn },
        });
      },
      inject: [UsersConfig],
    },
  ],
  exports: [
    UsersService,
    UsersRepository,
    MongooseModule,
    BasicAuthGuard,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
  ],
})
export class UsersModule {}
