import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileEntity } from '../models';
import { SharedModule } from '../shared/shared.module';
import { ProfileController } from './controllers/profile.controller';
import { UserController } from './controllers/user.controller';
import { ProfileService } from './services/profile.service';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  imports: [SequelizeModule.forFeature([ProfileEntity]), SharedModule],
  controllers: [UserController, ProfileController],
  providers: [UserService, ProfileService, UserResolver],
  exports: [UserService],
})
export class UsersModule {}
