import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_WARNING,
      signOptions: { expiresIn: process.env.TOKEN_TIME_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
