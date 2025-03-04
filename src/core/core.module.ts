import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './core.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  exports: [CoreConfig],
  providers: [CoreConfig],
})
export class CoreModule {}
