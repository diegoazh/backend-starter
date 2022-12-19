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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../auth/types/authenticated-request.type';
import { IAppQueryString } from '../../shared/interfaces/app-query-string.interface';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PatchProfileDto } from '../dto/patch-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileDeletedResponse } from '../responses/profile-deleted.response';
import { ProfileResponse } from '../responses/profile.response';
import { ProfilesCountResponse } from '../responses/profiles-count.response';
import { ProfilesResponse } from '../responses/profiles.response';
import { ProfileService } from '../services/profile.service';

@ApiTags('Profiles controller')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOkResponse({
    type: ProfilesResponse,
    description: 'A list of profiles',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  async find(@Query() query?: IAppQueryString): Promise<ProfilesResponse> {
    const profiles = await this.profileService.find(query);

    return {
      data: {
        profiles: profiles.map((profile) => profile.toJSON()),
      },
    };
  }

  @ApiFoundResponse({
    type: ProfileResponse,
    description: 'A profile object that match with the provided id',
  })
  @ApiNotFoundResponse({ description: 'Profile not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProfileResponse> {
    const profile = await this.profileService.findById(id);

    if (!profile) {
      throw new NotFoundException('profile_exception_not_found');
    }

    return { data: { profile: profile.toJSON() } };
  }

  @ApiOkResponse({
    type: ProfilesCountResponse,
    description: 'A sum of profiles found in the system',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<ProfilesCountResponse> {
    const { count } = await this.profileService.count(query);

    return { data: { profiles: { count } } };
  }

  @ApiCreatedResponse({
    type: ProfileResponse,
    description: 'A profile was created successfully',
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
    @Req() req: AuthenticatedRequest,
  ): Promise<ProfileResponse> {
    const newProfile = await this.profileService.create(profile, req.user);

    return { data: { profile: newProfile.toJSON() } };
  }

  @ApiOkResponse({
    type: ProfileResponse,
    description: 'A profile was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Put(':id')
  async overwrite(
    @Param('id') id: string,
    @Body() profile: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    const updatedProfile = await this.profileService.overwrite(id, profile);

    return { data: { profile: updatedProfile.toJSON() } };
  }

  @ApiOkResponse({
    type: ProfileResponse,
    description: 'A profile was updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    profile: PatchProfileDto,
  ): Promise<ProfileResponse> {
    const updatedProfile = await this.profileService.update(id, profile);

    return { data: { profile: updatedProfile.toJSON() } };
  }

  @ApiOkResponse({
    type: ProfileDeletedResponse,
    description: 'A profile was removed successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ProfileDeletedResponse> {
    const { deleted } = await this.profileService.remove(id);

    return { data: { profiles: { deleted } } };
  }
}
