import { Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { CryptoService } from './services/crypto.service';
import { NodeConfigService } from './services/node-config.service';

@Module({
  providers: [BcryptService, CryptoService, NodeConfigService],
  exports: [BcryptService, CryptoService, NodeConfigService],
})
export class SharedModule {}
