import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UsersQueryRepository } from './users-query.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { User, UserSchema } from '../../schemas';
import { UsersController } from './users.controller';
import { BasicAuthGuard } from './guards';
import { BasicStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    BasicAuthGuard,
    BasicStrategy,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
  ],
  exports: [UsersService, UsersRepository, MongooseModule],
})
export class UsersModule {}
