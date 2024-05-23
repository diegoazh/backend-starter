import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsArray,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements Omit<CreateUserDto, 'password'> {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(32, { message: 'user_username_max-length' })
  @MinLength(4, { message: 'user_username_min-length' })
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsArray()
  @IsOptional()
  requiredActions?: any[]; // TODO: fix this any type and the IsArray decorator

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @IsArray()
  @IsOptional()
  groups?: any[];

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
