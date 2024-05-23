import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'sequelize';
import { Column, HasMany, Table } from 'sequelize-typescript';
import { WrapperType } from '../shared/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { ProductEntity } from './product.entity';

export interface IProductCategoryAttributes extends IBaseAttributes {
  name: string;
  profit: number;
}

export interface IProductCategoryCreationAttributes
  extends Optional<
    IProductCategoryAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@InputType('ProductCategoryEntityInput')
@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'ProductCategories' })
export class ProductCategoryEntity extends BaseEntity<
  IProductCategoryAttributes,
  IProductCategoryCreationAttributes
> {
  @ApiProperty()
  @Field()
  @Column
  name: string;

  @ApiProperty()
  @Field()
  @Column
  profit: number;

  @ApiProperty({ type: () => [ProductEntity] })
  @Field(() => [ProductEntity!]!)
  @HasMany(() => ProductEntity)
  products: WrapperType<ProductEntity[]>;
}
