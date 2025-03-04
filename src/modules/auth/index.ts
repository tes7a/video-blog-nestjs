import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailManager } from '../../managers';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users';
import { AuthConfig } from './config';
import { CoreConfig } from '../../core/core.config';

@Module({
  imports: [
    ConfigModule,
    // TODO: after test's will fix, need to uncommit this config
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 5000,
    //     limit: 5,
    //   },
    // ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_TIME_EXPIRATION },
    }),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    UsersService,
    EmailManager,
    CoreConfig,
    AuthConfig,
  ],
  exports: [],
})
export class AuthModule {}
