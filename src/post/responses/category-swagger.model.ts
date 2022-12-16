import { ApiProperty } from '@nestjs/swagger';
import { ICategoryAttributes } from '../../models';
export abstract class CategoryModel implements ICategoryAttributes {
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
