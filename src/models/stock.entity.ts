import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { DineroOptions } from 'dinero.js';
import GraphQLJSON from 'graphql-type-json';
import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { StockType } from '../e-commerce/constants/stock.constant';
import { WrapperType } from '../shared/types';
import { DineroOptionsModel } from '../shared/utils';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { ProductEntity } from './product.entity';

registerEnumType(StockType, {
  name: 'StockType',
});

export interface IStockAttributes extends IBaseAttributes {
  productId: string;
  price: DineroOptions<number>;
  quantity: number;
  type: (typeof StockType)[keyof typeof StockType];
  priceHistory: JSON;
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
  @ApiProperty({
    type: () => DineroOptionsModel,
  })
  @Field(() => GraphQLJSON)
  @Column({ type: DataType.JSON })
  price: DineroOptions<number>;

  @ApiProperty()
  @Field(() => Number)
  @Column
  quantity: number;

  @ApiProperty({ enum: Object.values(StockType) })
  @Field(() => StockType)
  @Column({
    type: DataType.ENUM,
    values: Object.values(StockType),
  })
  type: (typeof StockType)[keyof typeof StockType];

  @ApiProperty({ type: String })
  @Field(() => GraphQLJSON)
  @Column({ type: DataType.JSON })
  priceHistory: JSON;

  @Field(() => String!)
  @ForeignKey(() => ProductEntity)
  productId: string;

  @ApiProperty({ type: () => ProductEntity })
  @Field(() => ProductEntity, { nullable: true })
  @BelongsTo(() => ProductEntity)
  product: WrapperType<ProductEntity>;
}
