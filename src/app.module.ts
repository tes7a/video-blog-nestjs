import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { BlogModule, UsersModule } from './modules';
import { ResetController } from './reset.controller';
import { CoreConfig, CoreModule } from './core';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        const uri = coreConfig.mongoUri;
        return { uri };
      },
      inject: [CoreConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 0,
        limit: 0,
      },
    ]),
    UsersModule,
    BlogModule,
  ],
  controllers: [ResetController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
