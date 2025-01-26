import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersQueryRepository } from './users-query.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/schemas';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  exports: [UsersService, UsersRepository, MongooseModule],
})
export class UsersModule {}
