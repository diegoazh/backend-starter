import { ApiProperty } from '@nestjs/swagger';
import { IUserAttributes } from '../../models';
import { UserRole } from '../constants/user.constant';

export abstract class UserModel implements IUserAttributes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: Object.values(UserRole) })
  role: typeof UserRole[keyof typeof UserRole];

  @ApiProperty()
  username?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
