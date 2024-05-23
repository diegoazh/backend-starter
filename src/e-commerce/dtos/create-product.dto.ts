import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IProductCreationAttributes } from '../../models';

@InputType({ description: 'data required to create a new product' })
export class CreateProductDto implements Partial<IProductCreationAttributes> {
  @ApiProperty()
  @Field()
  @MaxLength(80, { message: 'product_name_max-length' })
  @MinLength(3, { message: 'product_name_min-length' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Field()
  @MaxLength(3000, { message: 'product_images_max-length' })
  @IsString()
  @IsOptional()
  images?: string;

  @ApiProperty()
  @Field()
  @MaxLength(1000, { message: 'product_description_max-length' })
  @IsString()
  @IsOptional()
  description?: string;

  // @Field(() => ProductSize)
  // @IsEnum(ProductSize)
  // @IsNotEmpty()
  // size: (typeof ProductSize)[keyof typeof ProductSize];

  @ApiProperty()
  @Field()
  @IsBoolean()
  @IsNotEmpty()
  available: boolean;

  @Field()
  @MaxLength(1000, { message: 'product_categoryId_max-length' })
  @IsString()
  @IsNotEmpty()
  productCategoryId: string;
}
