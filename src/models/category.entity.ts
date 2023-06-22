import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { PostEntity } from './post.entity';

export interface ICategoryAttributes extends IBaseAttributes {
  name: string;
  parentId?: string;
}

interface ICategoryCreationAttributes
  extends Optional<
    ICategoryAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'Categories' })
export class CategoryEntity extends BaseEntity<
  ICategoryAttributes,
  ICategoryCreationAttributes
> {
  @ApiProperty()
  @Column
  name: string;

  @ApiProperty()
  @ForeignKey(() => CategoryEntity)
  parentId?: string;

  @BelongsTo(() => CategoryEntity)
  parent: CategoryEntity;

  @ApiProperty({ type: () => [CategoryEntity] })
  @HasMany(() => CategoryEntity)
  subcategories: CategoryEntity[];

  @ApiProperty({ type: () => [PostEntity] })
  @HasMany(() => PostEntity)
  posts: PostEntity[];
}
