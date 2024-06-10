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
import { StockEntity, TagEntity } from './models';
import {
  AppPaginatedResponse,
  AppResponse,
  PaginationLinks,
} from './shared/responses';
import { LoggedUserModel, UserModel } from './user/models';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Main');

  // If the cores configuration is managed by the nginx reverse proxy this must be disabled if not you must enabled
  // app.enableCors({
  //   origin: JSON.parse(configService.get<string>('APP_CORS_ORIGIN')),
  // });

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV !== 'production'
          ? false
          : {
              directives: {
                'img-src': [
                  'self',
                  'unsafe-inline',
                  'data:',
                  'cdn.jsdelivr.net',
                ],
                'script-src': [
                  'self',
                  'unsafe-inline',
                  'https://cdn.jsdelivr.net',
                ],
                'script-src-elem': [
                  'self',
                  'unsafe-inline',
                  'https://cdn.jsdelivr.net',
                ],
                'style-src': ['self', 'unsafe-inline'],
                'style-src-elem': [
                  'self',
                  'unsafe-inline',
                  'https://fonts.googleapis.com https://cdn.jsdelivr.net',
                ],
                'font-src': ['self', 'https://fonts.gstatic.com'],
                'default-src': ['self', 'unsafe-inline'],
              },
            },
    }),
  );
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
        UserModel,
        LoggedUserModel,
        PaginationLinks,
        AppPaginatedResponse,
        AppResponse,
        StockEntity,
      ],
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(
    parseInt(configService.get<string>('APP_PORT') || '3000', 10),
  );

  const uri = `http://localhost:${configService.get<string>('APP_PORT')}`;

  logger.log(`Application listen on ${uri}`);

  if (process.env.NODE_ENV !== 'production') {
    logger.log(`OpenAPI documentation  listen on ${uri}/api`);
    logger.log(`GraphiQL is running on ${uri}/graphql`);
  }
}
bootstrap();
