import {
  IsLowercase,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @MaxLength(200)
  @MinLength(5)
  @IsLowercase()
  @IsString()
  @IsNotEmpty()
  name: string;
}
