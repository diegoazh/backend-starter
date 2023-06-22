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
import { ProfileEntity } from '../../models';
import { LoggedUser } from '../../shared/decorators';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PatchProfileDto } from '../dto/patch-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { LoggedUserEntity } from '../models';
import { ProfileService } from '../services/profile.service';

@ApiTags('Profiles controller')
@Controller('profiles')
export class ProfileController {
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
  async find(
    @Query() query?: IAppQueryString,
  ): Promise<AppResponse<ProfileEntity[]>> {
    const profiles = await this.profileService.find(query);

    return {
      data: profiles.map((profile) => profile.toJSON()),
    };
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
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<AppResponse<number>> {
    const { count } = await this.profileService.count(query);

    return { data: count };
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
  async findById(@Param('id') id: string): Promise<AppResponse<ProfileEntity>> {
    const profile = await this.profileService.findById(id);

    if (!profile) {
      throw new NotFoundException('profile_exception_not_found');
    }

    return { data: profile.toJSON() };
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
  async create(
    @Body() profile: CreateProfileDto,
    @LoggedUser() user: LoggedUserEntity,
  ): Promise<AppResponse<ProfileEntity>> {
    const newProfile = await this.profileService.create(profile, user);

    return { data: newProfile.toJSON() };
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
  async overwrite(
    @Param('id') id: string,
    @Body() profile: UpdateProfileDto,
  ): Promise<AppResponse<ProfileEntity>> {
    const updatedProfile = await this.profileService.overwrite(id, profile);

    return { data: updatedProfile.toJSON() };
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
  async update(
    @Param('id') id: string,
    profile: PatchProfileDto,
  ): Promise<AppResponse<ProfileEntity>> {
    const updatedProfile = await this.profileService.update(id, profile);

    return { data: updatedProfile.toJSON() };
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
  async remove(@Param('id') id: string): Promise<AppResponse<number>> {
    const { deleted } = await this.profileService.remove(id);

    return { data: deleted };
  }
}
