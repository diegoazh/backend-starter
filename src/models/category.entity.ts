import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { WrapperType } from '../shared/types';
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

@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'Categories' })
export class CategoryEntity extends BaseEntity<
  ICategoryAttributes,
  ICategoryCreationAttributes
> {
  @ApiProperty()
  @Field(() => String!)
  @Column
  name: string;

  @ApiProperty()
  @Field(() => String, { nullable: true })
  @ForeignKey(() => CategoryEntity)
  parentId?: string;

  @Field(() => CategoryEntity, { nullable: true })
  @BelongsTo(() => CategoryEntity)
  parent: WrapperType<CategoryEntity>;

  @ApiProperty({ type: () => [CategoryEntity] })
  @Field(() => [CategoryEntity!]!)
  @HasMany(() => CategoryEntity)
  subcategories: WrapperType<CategoryEntity[]>;

  @ApiProperty({ type: () => [PostEntity] })
  @Field(() => [PostEntity!]!)
  @HasMany(() => PostEntity)
  posts: WrapperType<PostEntity[]>;
}
