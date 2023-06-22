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
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
      tokenValidation: TokenValidation.ONLINE,
      bearerOnly: true,
      realmPublicKey:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5Tnl61zap9uoGVwfMz738y48PXssG3DCSc4+b+gb53cWe5dTm5ciphJDy9N2QeGjOsKPC7SPF2aJXQMO6iPnc/J2reQ9KS5zH90s/tShLF136D/vMQkUBv771KWv1pEc4ztO2DAzRV0Qhxj5Jzu3R8Ff4OGQ1SFWwq3PrjMmaZZnQyxv93xuOBlFeQiZWNBHo7Xh0AkVaWexpMBNVoGqv+wyYZS6UeSEkx/0oGdojA113Zo2hiagthOGGXvx/RBtVBzefBa/03tt3P+Oo/MZ0deegM1tSklmdZx6GT/rGam9IamDsFe76WJVvTrHBXA0Cd0ggG4BeWR3zB6fK/3rxQIDAQAB',
    };
  }
}
