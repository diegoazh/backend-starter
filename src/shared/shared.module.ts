import { Module } from '@nestjs/common';
import { BcryptService, CryptoService, NodeConfigService } from './services';
import { KeycloakConfigService } from './services/keycloak-config.service';

@Module({
  providers: [
    BcryptService,
    CryptoService,
    NodeConfigService,
    KeycloakConfigService,
  ],
  exports: [
    BcryptService,
    CryptoService,
    NodeConfigService,
    KeycloakConfigService,
  ],
})
export class SharedModule {}
