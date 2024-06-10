import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { join } from 'path';
import dbConfig from '../config/db.config';
import { BlogModule } from './blog/blog.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import * as models from './models';
import GraphQLJSON from 'graphql-type-json';
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      resolvers: { JSON: GraphQLJSON },
    }),
    SharedModule,
    KeycloakModule,
    UsersModule,
    BlogModule,
    ECommerceModule,
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
