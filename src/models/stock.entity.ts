import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { StockType } from '../e-commerce/constants/stock.constant';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { WrapperType } from '../shared/types';
import { ProductCategoryEntity } from './product-category.entity';
import { ProductEntity } from './product.entity';

export interface IStockAttributes extends IBaseAttributes {
  productCategoryId: string;
  productId: string;
  price: number;
  quantity: number;
  type: ['ONSITE', 'ONLINE'];
  priceHistory: string;
}

export interface IStockCreationAttributes
  extends Optional<
    IStockAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'priceHistory'
  > {}

@InputType('StockEntityInput')
@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'Stocks' })
export class StockEntity extends BaseEntity<
  IStockAttributes,
  IStockCreationAttributes
> {
  @ApiProperty()
  @Field(() => String!)
  @ForeignKey(() => ProductCategoryEntity)
  productCategoryId: string;

  @Field(() => ProductCategoryEntity, { nullable: true })
  @BelongsTo(() => ProductCategoryEntity)
  productCategory: WrapperType<ProductCategoryEntity>;

  @ApiProperty()
  @Field(() => String!)
  @ForeignKey(() => ProductEntity)
  productId: string;

  @Field(() => ProductEntity, { nullable: true })
  @BelongsTo(() => ProductEntity)
  product: WrapperType<ProductEntity>;

  @ApiProperty()
  @Field()
  @Column
  price: number;

  @ApiProperty()
  @Field()
  @Column
  quantity: number;

  @ApiProperty()
  @Field()
  @Column({ type: DataType.ENUM, values: Object.values(StockType) })
  type: (typeof StockType)[keyof typeof StockType];

  @ApiProperty()
  @Field()
  @Column
  priceHistory: string;
}
