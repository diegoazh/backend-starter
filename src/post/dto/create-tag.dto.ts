import {
  IsLowercase,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @MaxLength(200)
  @MinLength(3)
  @IsLowercase()
  @IsString()
  @IsNotEmpty()
  name: string;
}
