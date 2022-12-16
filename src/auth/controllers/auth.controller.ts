import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserResponse } from '../../user/responses/user.response';
import { UserService } from '../../user/services/user.service';
import { CredentialsDto } from '../dto/credentials.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginResponse } from '../responses/login.response';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types/authenticated-request.type';

@ApiTags('Auth controller')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiCreatedResponse({
    type: LoginResponse,
    description: 'Successfully login in the system',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Body() credentials: CredentialsDto,
    @Request() req: AuthenticatedRequest,
  ): LoginResponse {
    return this.authService.login(req.user);
  }

  @ApiCreatedResponse({
    type: UserResponse,
    description: 'A user was created successfully',
  })
  @ApiConflictResponse({
    description: 'when a user already exists with the same main constraints',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async create(@Body() user: CreateUserDto): Promise<UserResponse> {
    const newUser = await this.userService.create(user);

    return { data: { user: newUser.toJSON() } };
  }
}