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
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { PostEntity } from '../../models';
import { AppScopes } from '../../shared/constants';
import { LoggedUser } from '../../shared/decorators';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { LoggedUserEntity } from '../../user/models';
import { CreatePostDto } from '../dto/create-post.dto';
import { PatchPostDto } from '../dto/patch-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostService } from '../services/post.service';

@ApiTags('Posts controller')
@ApiHeader({
  name: 'X-Apikey',
  description: 'Valid api key to contact service behind gateway',
  example: 'abcdefghijklmnopqrstuvwxyz',
})
@ApiBearerAuth()
@Resource('post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({
    description: 'A list of posts',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(PostEntity) },
            },
          },
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  // @Roles({ roles: ['admin'] })
  @Scopes(AppScopes.READ)
  @Get()
  async find(
    @Query() query?: IAppQueryString,
  ): Promise<AppPaginatedResponse<PostEntity[]>> {
    const posts = await this.postService.find(query);

    return {
      data: posts.map((post) => post.toJSON()),
    };
  }

  @ApiOkResponse({
    description: 'A sum of all posts in the system',
    schema: {
      properties: {
        data: { type: 'integer' },
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.READ)
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<AppResponse<number>> {
    const { count } = await this.postService.count(query);

    return { data: count };
  }

  @ApiFoundResponse({
    description: 'A found post',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(PostEntity) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Any post was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Scopes(AppScopes.READ)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<AppResponse<PostEntity>> {
    const post = await this.postService.findById(id);

    if (!post) {
      throw new NotFoundException('post_exception_not_found');
    }

    return { data: post.toJSON() };
  }

  @ApiCreatedResponse({
    description: 'The post was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(PostEntity) },
      },
    },
  })
  @ApiConflictResponse({
    description: 'A previous post was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Post()
  async create(
    @Body() postData: CreatePostDto,
    @LoggedUser() user: LoggedUserEntity,
  ): Promise<AppResponse<PostEntity>> {
    const newPost = await this.postService.create(postData, user);

    return { data: newPost.toJSON() };
  }

  @ApiOkResponse({
    description: 'The post was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(PostEntity) },
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
    @Body() postData: UpdatePostDto,
  ): Promise<AppResponse<PostEntity>> {
    const updatedPost = await this.postService.overwrite(id, postData);

    return { data: updatedPost.toJSON() };
  }

  @ApiOkResponse({
    description: 'The post was updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(PostEntity) },
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
    postData: PatchPostDto,
  ): Promise<AppResponse<PostEntity>> {
    const updatedPost = await this.postService.update(id, postData);

    return { data: updatedPost.toJSON() };
  }

  @ApiOkResponse({
    description: 'The post was overwrite successfully',
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
    const { deleted } = await this.postService.remove(id);

    return { data: deleted };
  }
}
