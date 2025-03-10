import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { APP_GUARD } from '@nestjs/core';
// import { ThrottlerGuard } from '@nestjs/throttler';

import {
  BlogsModule,
  CommentsModule,
  PostsModule,
  UsersModule,
} from './modules';
import { ResetController } from './reset.controller';
import { CoreConfig, CoreModule } from './core';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        const uri = coreConfig.mongoUri;
        console.log('DB_URI', uri);
        return { uri };
      },
      inject: [CoreConfig],
    }),
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [ResetController],
  providers: [
    // TODO: after test's will fix, need to uncommit this config
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
