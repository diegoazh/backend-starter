import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Min,
} from 'class-validator';
import { DineroOptions } from 'dinero.js';
import { IStockCreationAttributes } from '../../models';
import { DineroOptionsModel } from '../../shared/utils';
import { StockType } from '../constants/stock.constant';

export class CreateStockDto implements IStockCreationAttributes {
  @ApiProperty({ type: () => DineroOptionsModel })
  @IsObject()
  @IsNotEmpty()
  price: DineroOptions<number>;

  @ApiProperty()
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ enum: Object.values(StockType) })
  @IsEnum(StockType)
  @IsNotEmpty()
  type: (typeof StockType)[keyof typeof StockType];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;
}
