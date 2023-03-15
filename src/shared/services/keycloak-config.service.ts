import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { NodeConfigService } from './node-config.service';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private readonly nodeConfig: NodeConfigService) {}

  public async createKeycloakConnectOptions(): Promise<KeycloakConnectOptions> {
    await ConfigModule.envVariablesLoaded;

    return {
      authServerUrl: this.nodeConfig.config.get('keycloak.authServerUrl'),
      realm: this.nodeConfig.config.get('keycloak.realm'),
      clientId: this.nodeConfig.config.get('keycloak.clientId'),
      secret: this.nodeConfig.config.get('keycloak.clientSecret'),
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    };
  }
}
