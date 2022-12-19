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
import { CreatePostDto } from '../dto/create-post.dto';
import { PatchPostDto } from '../dto/patch-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostDeletedResponse } from '../responses/post-deleted.response';
// import { PostModel } from '../responses/post-swagger.model';
import { PostResponse } from '../responses/post.response';
import { PostsCountResponse } from '../responses/posts-count.response';
import { PostsResponse } from '../responses/posts.response';
import { PostService } from '../services/post.service';

@ApiTags('Posts controller')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({
    type: PostsResponse,
    description: 'A list of posts',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  async find(@Query() query?: IAppQueryString): Promise<PostsResponse> {
    const posts = await this.postService.find(query);

    return {
      data: { posts: posts.map((post) => post.toJSON()) },
    };
  }

  @ApiFoundResponse({
    type: PostResponse,
    description: 'A found post',
  })
  @ApiNotFoundResponse({ description: 'Any post was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<PostResponse> {
    const post = await this.postService.findById(id);

    if (!post) {
      throw new NotFoundException('post_exception_not_found');
    }

    return { data: { post: post.toJSON() } };
  }

  @ApiOkResponse({
    type: PostsCountResponse,
    description: 'A sum of all posts in the system',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<PostsCountResponse> {
    const { count } = await this.postService.count(query);

    return { data: { posts: { count } } };
  }

  @ApiCreatedResponse({
    type: PostResponse,
    description: 'The post was created successfully',
  })
  @ApiConflictResponse({
    description: 'A previous post was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() postData: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PostResponse> {
    const newPost = await this.postService.create(postData, req.user);

    return { data: { post: newPost.toJSON() } };
  }

  @ApiOkResponse({
    type: PostResponse,
    description: 'The post was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async overwrite(
    @Param('id') id: string,
    @Body() postData: UpdatePostDto,
  ): Promise<PostResponse> {
    const updatedPost = await this.postService.overwrite(id, postData);

    return { data: { post: updatedPost.toJSON() } };
  }

  @ApiOkResponse({
    type: PostResponse,
    description: 'The post was updated successfully',
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
    postData: PatchPostDto,
  ): Promise<PostResponse> {
    const updatedPost = await this.postService.update(id, postData);

    return { data: { post: updatedPost.toJSON() } };
  }

  @ApiOkResponse({
    type: PostDeletedResponse,
    description: 'The post was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostDeletedResponse> {
    const { deleted } = await this.postService.remove(id);

    return { data: { posts: { deleted } } };
  }
}
