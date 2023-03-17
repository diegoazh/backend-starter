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
} from '@nestjs/common';
import {
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Users controller')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'A list of found users',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UserEntity) },
            },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  async find(
    @Query() query?: IAppQueryString,
  ): Promise<AppPaginatedResponse<UserEntity[]>> {
    const users = await this.userService.find(query);

    return { data: users.map((user) => user.toJSON()) };
  }

  @ApiFoundResponse({
    description: 'A user object that match with the provided id',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(UserEntity) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<AppResponse<UserEntity>> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('user_exception_not_found');
    }

    return { data: user.toJSON() };
  }

  @ApiOkResponse({
    description: 'The sum of all users in the system',
    schema: {
      properties: {
        data: {
          type: 'integer',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<AppPaginatedResponse<number>> {
    const { count } = await this.userService.count(query);

    return { data: count };
  }

  @ApiOkResponse({
    description: 'The user was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(UserEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Put(':id')
  async overwrite(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<AppResponse<UserEntity>> {
    const updatedUser = await this.userService.overwrite(id, user);

    return { data: updatedUser.toJSON() };
  }

  @ApiOkResponse({
    description: 'The properties of the user were updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(UserEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    user: PatchUserDto,
  ): Promise<AppResponse<UserEntity>> {
    const updatedUser = await this.userService.update(id, user);

    return { data: updatedUser.toJSON() };
  }

  @ApiOkResponse({
    description: 'The user was deleted successfully',
    schema: {
      properties: {
        data: { type: 'integer' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<AppResponse<number>> {
    const { deleted } = await this.userService.remove(id);

    return { data: deleted };
  }
}
