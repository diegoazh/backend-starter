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
import { IAppQueryString } from '../../shared/interfaces/app-query-string.interface';
import { CreateTagDto } from '../dto/create-tag.dto';
import { PatchTagDto } from '../dto/patch-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagDeletedResponse } from '../responses/tag-deleted.response';
import { TagResponse } from '../responses/tag.response';
import { TagsCountResponse } from '../responses/tags-count.response';
import { TagsResponse } from '../responses/tags.response';
import { TagService } from '../services/tag.service';

@ApiTags('Tags controller')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOkResponse({
    type: TagsResponse,
    description: 'A list of tags',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  public async find(@Query() query?: IAppQueryString): Promise<TagsResponse> {
    const tags = await this.tagService.find(query);

    return {
      data: {
        tags: tags.map((tag) => tag.toJSON()),
      },
    };
  }

  @ApiFoundResponse({
    type: TagResponse,
    description: 'A found tag',
  })
  @ApiNotFoundResponse({ description: 'Any tag was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<TagResponse> {
    const tag = await this.tagService.findById(id);

    if (!tag) {
      throw new NotFoundException('tag_exception_not_found');
    }

    return { data: { tag: tag.toJSON() } };
  }

  @ApiOkResponse({
    type: TagsCountResponse,
    description: 'A sum of all categories in the system',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<TagsCountResponse> {
    const { count } = await this.tagService.count(query);

    return { data: { tags: { count } } };
  }

  @ApiCreatedResponse({
    type: TagResponse,
    description: 'The tag was created successfully',
  })
  @ApiConflictResponse({
    description: 'A previous tag was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Body() tagData: CreateTagDto): Promise<TagResponse> {
    const newTag = await this.tagService.create(tagData);

    return { data: { tag: newTag.toJSON() } };
  }

  @ApiOkResponse({
    type: TagResponse,
    description: 'The tag was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async overwrite(
    @Param('id') id: string,
    @Body() tagData: UpdateTagDto,
  ): Promise<TagResponse> {
    const updatedTag = await this.tagService.overwrite(id, tagData);

    return { data: { tag: updatedTag.toJSON() } };
  }

  @ApiOkResponse({
    type: TagResponse,
    description: 'The tag was updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    tagData: PatchTagDto,
  ): Promise<TagResponse> {
    const updateCategory = await this.tagService.update(id, tagData);

    return { data: { tag: updateCategory.toJSON() } };
  }

  @ApiOkResponse({
    type: TagDeletedResponse,
    description: 'The tag was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TagDeletedResponse> {
    const { deleted } = await this.tagService.remove(id);

    return { data: { tags: { deleted } } };
  }
}
