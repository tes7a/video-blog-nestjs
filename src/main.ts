import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/exception.filter';
import { CoreConfig } from './core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const coreConfig = app.get<CoreConfig>(CoreConfig);

  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Video Blog API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api-docs', app, document);

  if (process.env.NODE_ENV === 'development') {
    const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      'swagger.json',
    );

    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(
      `Swagger JSON file written to: '/swagger-static/api-docs.json'`,
    );
  }

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
