import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Resource, Scopes } from 'nest-keycloak-connect';
import errors from '../../../errors/errors_messages.json';
import { AppResources, AppScopes } from '../../shared/constants';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { parseErrorsToHttpErrors } from '../../shared/utils';
import { CreateUserDto, PatchUserDto, UpdateUserDto } from '../dto';
import { UserModel } from '../models';
import { UserService } from '../services/user.service';

@ApiTags('Users controller')
@ApiBearerAuth()
@Resource(AppResources.USER)
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

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
              items: { $ref: getSchemaPath(UserModel) },
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
  @Scopes(AppScopes.READ)
  @Get()
  async find(@Req() req: Request): Promise<AppPaginatedResponse<UserModel[]>> {
    try {
      const { authorization } = req.headers;
      const users = await this.userService.find(authorization);

      return { data: users };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
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
  @Scopes(AppScopes.READ)
  @Get('count')
  async count(@Req() req: Request): Promise<AppPaginatedResponse<number>> {
    try {
      const { authorization } = req.headers;
      const { count } = await this.userService.count(authorization);

      return { data: count };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'A user object that match with the provided id',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(UserModel) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.READ)
  @Get(':id')
  async findById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<AppResponse<UserModel>> {
    try {
      const { authorization } = req.headers;
      const user = await this.userService.findById(id, authorization);

      if (!user) {
        throw new NotFoundException(errors['user_exception_not-found'], {
          cause: new Error(errors['user_exception_not-found']),
          description: errors['user_exception_not-found'],
        });
      }

      return { data: user };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiCreatedResponse({
    description: 'The user was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(UserModel) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Req() req: Request,
    @Body() data: CreateUserDto,
  ): Promise<AppPaginatedResponse<UserModel>> {
    try {
      const { authorization } = req.headers;
      const user = await this.userService.create(data, authorization);
      return { data: user };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The user was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(UserModel) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.UPDATE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Put(':id')
  async overwrite(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<AppResponse<UserModel>> {
    try {
      const { authorization } = req.headers;
      const updatedUser = await this.userService.overwrite(
        id,
        user,
        authorization,
      );

      return { data: updatedUser };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The properties of the user were updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(UserModel) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.UPDATE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    user: PatchUserDto,
  ): Promise<AppResponse<UserModel>> {
    try {
      const { authorization } = req.headers;
      const updatedUser = await this.userService.update(
        id,
        user,
        authorization,
      );

      return { data: updatedUser };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiNoContentResponse({
    description: 'The user was deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    try {
      const { authorization } = req.headers;
      await this.userService.remove(id, authorization);
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }
}
