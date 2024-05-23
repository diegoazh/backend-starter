import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import {
  ProductSize,
  ProductStatus,
} from '../e-commerce/constants/product.constant';
import { WrapperType } from '../shared/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { ProductCategoryEntity } from './product-category.entity';

registerEnumType(ProductSize, { name: 'ProductSize' });
registerEnumType(ProductStatus, { name: 'ProductStatus' });

export interface IProductAttributes extends IBaseAttributes {
  name: string;
  images?: string;
  size: (typeof ProductSize)[keyof typeof ProductSize];
  description?: string;
  available: boolean;
  status?: (typeof ProductStatus)[keyof typeof ProductStatus];
  productCategoryId: string;
}

export interface IProductCreationAttributes
  extends Optional<
    IProductAttributes,
    | 'id'
    | 'size'
    | 'description'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

@InputType('ProductEntityInput')
@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'Products' })
export class ProductEntity extends BaseEntity<
  IProductAttributes,
  IProductCreationAttributes
> {
  @ApiProperty()
  @Field()
  @Column
  name: string;

  @ApiProperty()
  @Field()
  @Column
  images: string;

  @ApiProperty({ enum: Object.values(ProductSize) })
  @Field(() => ProductSize)
  @Column({
    type: DataType.ENUM,
    values: Object.values(ProductSize),
  })
  size: (typeof ProductSize)[keyof typeof ProductSize];

  @ApiProperty()
  @Field()
  @Column
  description: string;

  @ApiProperty()
  @Field()
  @Column
  available: boolean;

  @ApiProperty({ enum: Object.values(ProductStatus) })
  @Field(() => ProductStatus)
  @Column({
    type: DataType.ENUM,
    values: Object.values(ProductStatus),
  })
  status: (typeof ProductStatus)[keyof typeof ProductStatus];

  @ApiProperty()
  @Field(() => String!)
  @ForeignKey(() => ProductCategoryEntity)
  productCategoryId: string;

  @Field(() => ProductCategoryEntity, { nullable: true })
  @BelongsTo(() => ProductCategoryEntity)
  productCategory: WrapperType<ProductCategoryEntity>;
}
