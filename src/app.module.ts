import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import dbConfig from '../config/db.config';
import { KeycloakModule } from './keycloak/keycloak.module';
import * as models from './models';
import { BlogModule } from './blog/blog.module';
import { KeycloakConfigService } from './shared/services';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `./environments/.env.${
        process.env.NODE_ENV || 'development'
      }`,
    }),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [SharedModule],
    }),
    SequelizeModule.forRoot({
      ...dbConfig,
      models: Object.values(models).filter(
        (model) => model.name !== 'BaseEntity',
      ),
      autoLoadModels: true,
      synchronize: true,
    }),
    SharedModule,
    KeycloakModule,
    UsersModule,
    BlogModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
