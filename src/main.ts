import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/exception.filter';
import { CoreConfig } from './core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const coreConfig = app.get<CoreConfig>(CoreConfig);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];

        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints);
          constraintsKeys.forEach((ckey) => {
            errorsForResponse.push({
              message: e.constraints[ckey],
              field: e.property,
            });
          });
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log('App starting listen port: ', port);
  });
}
bootstrap();
