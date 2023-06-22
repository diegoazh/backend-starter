import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { TagEntity } from './models';
import { AppPaginatedResponse, AppResponse } from './shared/responses';
import { LoggedUserEntity, UserEntity } from './user/models';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Main');

  // If the cores configuration is managed by the nginx reverse proxy this must be disabled if not you must enabled
  // app.enableCors({
  //   origin: JSON.parse(configService.get<string>('APP_CORS_ORIGIN')),
  // });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NestJs backend starter')
      .setDescription('Backend starter API for simple web apps or blogs')
      .setVersion(version)
      .addTag('Resources')
      .addBearerAuth()
      .build();
    const options: SwaggerDocumentOptions = {
      extraModels: [
        TagEntity,
        UserEntity,
        LoggedUserEntity,
        AppPaginatedResponse,
        AppResponse,
      ],
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(parseInt(configService.get<string>('APP_PORT'), 10));

  const uri = `http://localhost:${configService.get<string>('APP_PORT')}`;

  logger.log(`Application listen on ${uri}`);

  if (process.env.NODE_ENV !== 'production') {
    logger.log(`OpenAPI documentation  listen on ${uri}/api`);
  }
}
bootstrap();
