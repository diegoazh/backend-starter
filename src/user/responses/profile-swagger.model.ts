import { ApiProperty } from '@nestjs/swagger';
import { IProfileAttributes } from '../../models';

export abstract class ProfileModel implements IProfileAttributes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
