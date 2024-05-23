import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IProductCategoryCreationAttributes } from '../../models';

@InputType({ description: 'data required to create a new product category' })
export class CreateProductCategoryDto
  implements Partial<IProductCategoryCreationAttributes>
{
  @ApiProperty()
  @Field()
  @MaxLength(80, { message: 'product_category_name_max-length' })
  @MinLength(3, { message: 'product_category_name_min-length' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Field()
  @IsNumberString()
  @IsNotEmpty()
  profit: number;
}
