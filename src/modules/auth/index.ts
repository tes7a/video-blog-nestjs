import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users';
import { EmailManager } from 'src/managers';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_TIME_EXPIRATION },
    }),
    PassportModule.register({ defaultStrategy: process.env.LOCAL_GUARD }),
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
  ],
  exports: [],
})
export class AuthModule {}
