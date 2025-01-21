import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { UsersModule } from 'src/users';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_WARNING,
      signOptions: { expiresIn: process.env.TOKEN_TIME_EXPIRATION },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
  ],
  exports: [],
})
export class AuthModule {}
