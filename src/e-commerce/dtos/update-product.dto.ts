import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IProductAttributes } from '../../models';

@InputType()
export class UpdateProductDto
  implements
    Omit<
      IProductAttributes,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'size' | 'status'
    >
{
  @Field()
  @MaxLength(80, { message: 'product_name_max-length' })
  @MinLength(3, { message: 'product_name_min-length' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @MaxLength(3000, { message: 'product_images_max-length' })
  @IsString()
  @IsOptional()
  images?: string;

  @Field()
  @MaxLength(3000, { message: 'product_description_max-length' })
  @IsString()
  @IsOptional()
  description?: string;

  // @Field(() => ProductSize)
  // @IsEnum(ProductSize)
  // @IsNotEmpty()
  // size: (typeof ProductSize)[keyof typeof ProductSize];

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
