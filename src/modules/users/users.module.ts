import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersQueryRepository } from './infrastructure/query/users-query.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersService } from './services/users.service';
import { User, UserSchema } from '../../schemas';
import { UsersController } from './controllers/users.controller';
import { BasicAuthGuard, JwtAuthGuard, LocalAuthGuard } from './guards';
import { BasicStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { UsersConfig } from './config/users.config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EmailManager } from 'src/managers';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // TODO: after test's will fix, need to uncommit this config
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 5000,
    //     limit: 5,
    //   },
    // ]),

    // TODO: after need reconfigure this and split to another provider module with use cases!!!!
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('TOKEN_TIME_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
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
  ],
  exports: [UsersService, UsersRepository, MongooseModule],
})
export class UsersModule {}
