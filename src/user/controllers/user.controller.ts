import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IAppQueryString } from '../../shared/interfaces/app-query-string.interface';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDeletedResponse } from '../responses/user-deleted.response';
import { UserResponse } from '../responses/user.response';
import { UsersCountResponse } from '../responses/users-count.response';
import { UsersResponse } from '../responses/users.response';
import { UserService } from '../services/user.service';

@ApiTags('Users controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    type: UsersResponse,
    description: 'A list of found users',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  async find(@Query() query?: IAppQueryString): Promise<UsersResponse> {
    const users = await this.userService.find(query);

    return { data: { users: users.map((user) => user.toJSON()) } };
  }

  @ApiFoundResponse({
    type: UserResponse,
    description: 'A user object that match with the provided id',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('user_exception_not_found');
    }

    return { data: { user: user.toJSON() } };
  }

  @ApiOkResponse({
    type: UsersCountResponse,
    description: 'The sum of all users in the system',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<UsersCountResponse> {
    const { count } = await this.userService.count(query);

    return { data: { users: { count } } };
  }

  @ApiOkResponse({
    type: UserResponse,
    description: 'The user was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Put(':id')
  async overwrite(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserResponse> {
    const updatedUser = await this.userService.overwrite(id, user);

    return { data: { user: updatedUser.toJSON() } };
  }

  @ApiOkResponse({
    type: UserResponse,
    description: 'The properties of the user were updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    user: PatchUserDto,
  ): Promise<UserResponse> {
    const updatedUser = await this.userService.update(id, user);

    return { data: { user: updatedUser.toJSON() } };
  }

  @ApiOkResponse({
    type: UserDeletedResponse,
    description: 'The user was deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserDeletedResponse> {
    const { deleted } = await this.userService.remove(id);

    return { data: { users: { deleted } } };
  }
}
