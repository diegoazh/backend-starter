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
export class PatchProductDto
  implements
    Partial<
      Omit<
        IProductAttributes,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'size' | 'status'
      >
    >
{
  @Field()
  @MaxLength(80, { message: 'product_name_max-length' })
  @MinLength(3, { message: 'product_name_min-length' })
  @IsString()
  @IsOptional()
  name?: string;

  @Field()
  @MaxLength(3000, { message: 'product_name_max-length' })
  @IsString()
  @IsOptional()
  images?: string;

  @Field()
  @MaxLength(3000, { message: 'product_name_max-length' })
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @Field()
  @MaxLength(3000, { message: 'product_categoryId_max-length' })
  @IsString()
  @IsNotEmpty()
  productCategoryId: string;
}
