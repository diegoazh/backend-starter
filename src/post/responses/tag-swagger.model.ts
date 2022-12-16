import { ApiProperty } from '@nestjs/swagger';
import { ITagAttributes } from '../../models';
export abstract class TagModel implements ITagAttributes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
