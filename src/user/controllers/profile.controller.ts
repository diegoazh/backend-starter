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
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import errors from '../../../errors/errors_messages.json';
import { ProfileEntity } from '../../models';
import { LoggedUser } from '../../shared/decorators';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { parseErrorsToHttpErrors } from '../../shared/utils';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PatchProfileDto } from '../dto/patch-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { LoggedUserModel } from '../models';
import { ProfileService } from '../services/profile.service';

@ApiTags('Profiles controller')
@Controller('profiles')
export class ProfileController {
  private readonly logger = new Logger('ProfileController');

  constructor(private readonly profileService: ProfileService) {}

  @ApiOkResponse({
    description: 'A list of profiles',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ProfileEntity) },
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
  public async find(
    @Query() query?: IAppQueryString,
  ): Promise<AppResponse<ProfileEntity[]>> {
    try {
      const profiles = await this.profileService.find(query);

      return {
        data: profiles.map((profile) => profile.toJSON()),
      };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'The sum of all profiles found in the system',
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
  @Get('count')
  public async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<AppResponse<number>> {
    try {
      const { count } = await this.profileService.count(query);

      return { data: count };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiFoundResponse({
    description: 'A profile object that match with the provided id',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProfileEntity) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Profile not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<AppResponse<ProfileEntity>> {
    try {
      const profile = await this.profileService.findById(id);

      if (!profile) {
        throw new NotFoundException(errors['profile_exception_not-found'], {
          cause: new Error(errors['profile_exception_not-found']),
          description: errors['profile_exception_not-found'],
        });
      }

      return { data: profile.toJSON() };
    } catch (error) {
      this.logger.error(`PROFILE_BY_ID: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiCreatedResponse({
    description: 'A profile was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProfileEntity) },
      },
    },
  })
  @ApiConflictResponse({
    description: 'when profile already exists with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(
    @Body() profile: CreateProfileDto,
    @LoggedUser() user: LoggedUserModel,
  ): Promise<AppResponse<ProfileEntity>> {
    try {
      const newProfile = await this.profileService.create(profile, user);

      return { data: newProfile.toJSON() };
    } catch (error) {
      this.logger.error(`PROFILE_CREATE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'A profile was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProfileEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Put(':id')
  public async overwrite(
    @Param('id') id: string,
    @Body() profile: UpdateProfileDto,
  ): Promise<AppResponse<ProfileEntity>> {
    try {
      const updatedProfile = await this.profileService.overwrite(id, profile);

      if (!updatedProfile) {
        throw new NotFoundException(errors['profile_exception_not-found'], {
          cause: new Error(errors['profile_exception_not-found']),
          description: errors['profile_exception_not-found'],
        });
      }

      return { data: updatedProfile.toJSON() };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'A profile was updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProfileEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    profile: PatchProfileDto,
  ): Promise<AppResponse<ProfileEntity>> {
    try {
      const updatedProfile = await this.profileService.update(id, profile);

      if (!updatedProfile) {
        throw new NotFoundException(errors['profile_exception_not-found'], {
          cause: new Error(errors['profile_exception_not-found']),
          description: errors['profile_exception_not-found'],
        });
      }

      return { data: updatedProfile.toJSON() };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'A profile was removed successfully',
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
  public async remove(@Param('id') id: string): Promise<AppResponse<number>> {
    try {
      const result = await this.profileService.remove(id);

      if (!result) {
        throw new NotFoundException(errors['profile_exception_not-found'], {
          cause: new Error(errors['profile_exception_not-found']),
          description: errors['profile_exception_not-found'],
        });
      }

      return { data: result.deleted };
    } catch (error) {
      this.logger.error(error);
      throw parseErrorsToHttpErrors(error);
    }
  }
}
