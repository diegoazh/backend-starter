import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType({ description: 'Data needed to create a new user' })
export class CreateUserDto {
  @Field()
  @IsEmail()
  @IsLowercase()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field()
  @MaxLength(32, { message: 'user_pwd_max-length' })
  @MinLength(8, { message: 'user_pwd_min-length' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @MaxLength(32, { message: 'user_username_max-length' })
  @MinLength(4, { message: 'user_username_min-length' })
  @IsLowercase()
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsLowercase()
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsLowercase()
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field(() => [String!], { nullable: true })
  @IsArray()
  @IsOptional()
  requiredActions?: string[]; // TODO: change this to an enum type

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @Field(() => [String!], { nullable: true })
  @IsArray()
  @IsOptional()
  groups?: string[]; // TODO: change this to an enum type

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
