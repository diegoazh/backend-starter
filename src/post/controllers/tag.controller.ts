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
  ApiBearerAuth,
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
import { Public, Resource, Scopes } from 'nest-keycloak-connect';
import { TagEntity } from '../../models';
import { AppScopes } from '../../shared/constants';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { CreateTagDto } from '../dto/create-tag.dto';
import { PatchTagDto } from '../dto/patch-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagService } from '../services/tag.service';

@ApiTags('Tags controller')
@Resource('tag')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOkResponse({
    description: 'A list of tags',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(TagEntity) },
            },
          },
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.READ)
  @Public()
  @Get()
  public async find(
    @Query() query?: IAppQueryString,
  ): Promise<AppPaginatedResponse<TagEntity[]>> {
    const tags = await this.tagService.find(query);

    return {
      data: tags.map((tag) => tag.toJSON()),
    };
  }

  @ApiOkResponse({
    description: 'A sum of all categories in the system',
    schema: {
      properties: {
        data: { type: 'integer' },
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.READ)
  @Public()
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<AppResponse<number>> {
    const { count } = await this.tagService.count(query);

    return { data: count };
  }

  @ApiFoundResponse({
    description: 'A found tag',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(TagEntity) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Any tag was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Scopes(AppScopes.READ)
  @Public()
  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<AppResponse<TagEntity>> {
    const tag = await this.tagService.findById(id);

    if (!tag) {
      throw new NotFoundException('tag_exception_not_found');
    }

    return { data: tag.toJSON() };
  }

  @ApiCreatedResponse({
    description: 'The tag was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(TagEntity) },
      },
    },
  })
  @ApiConflictResponse({
    description: 'A previous tag was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @Scopes(AppScopes.CREATE)
  @Post()
  public async create(
    @Body() tagData: CreateTagDto,
  ): Promise<AppResponse<TagEntity>> {
    const newTag = await this.tagService.create(tagData);

    return { data: newTag.toJSON() };
  }

  @ApiOkResponse({
    description: 'The tag was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(TagEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @Scopes(AppScopes.UPDATE)
  @Put(':id')
  public async overwrite(
    @Param('id') id: string,
    @Body() tagData: UpdateTagDto,
  ): Promise<AppResponse<TagEntity>> {
    const updatedTag = await this.tagService.overwrite(id, tagData);

    return { data: updatedTag.toJSON() };
  }

  @ApiOkResponse({
    description: 'The tag was updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(TagEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @Scopes(AppScopes.UPDATE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    tagData: PatchTagDto,
  ): Promise<AppResponse<TagEntity>> {
    const updateCategory = await this.tagService.update(id, tagData);

    return { data: updateCategory.toJSON() };
  }

  @ApiOkResponse({
    description: 'The tag was overwrite successfully',
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
  @ApiBearerAuth()
  @Scopes(AppScopes.DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<AppResponse<number>> {
    const { deleted } = await this.tagService.remove(id);

    return { data: deleted };
  }
}
