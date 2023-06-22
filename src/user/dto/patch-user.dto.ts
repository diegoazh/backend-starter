import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class PatchUserDto implements Partial<Omit<CreateUserDto, 'password'>> {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @MaxLength(32, { message: 'user_username_max_length' })
  @MinLength(4, { message: 'user_username_min_length' })
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
  requiredActions?: string[];

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @IsArray()
  @IsOptional()
  groups?: any[]; // TODO: fix this any type and the IsArray decorator

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
