import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { BasicAuthGuard, JwtAuthGuard, LocalAuthGuard } from './guards';
import { BasicStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { UsersConfig } from './config/users.config';
import { User, UserSchema } from './schemas';
import { AuthController, UsersController } from './controllers';
import { AuthService, UsersService } from './services';
import { UsersQueryRepository, UsersRepository } from './infrastructure';
import { EmailManager } from './managers';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constans';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    // TODO: after test's will fix, need to uncommit this config
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 5000,
    //     limit: 5,
    //   },
    // ]),

    // TODO: after need reconfigure this and split to another provider module with use cases!!!!
  ],
  controllers: [UsersController, AuthController],
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
    EmailManager,
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
  ],
})
export class UsersModule {}
