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
import { Public, Resource, Scopes } from 'nest-keycloak-connect';
import { CategoryEntity } from '../../models';
import { AppScopes } from '../../shared/constants';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories controller')
@Resource('category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({
    description: 'A list of categories',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CategoryEntity) },
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
  ): Promise<AppPaginatedResponse<CategoryEntity[]>> {
    const categories = await this.categoryService.find(query);

    return {
      data: categories.map((category) => category.toJSON()),
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
    const { count } = await this.categoryService.count({ ...query });

    return { data: count };
  }

  @ApiFoundResponse({
    description: 'A found category',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(CategoryEntity) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Any category was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Scopes(AppScopes.READ)
  @Public()
  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<AppResponse<CategoryEntity>> {
    const category = await this.categoryService.findById(id);

    if (!category) {
      throw new NotFoundException('category_exception_not_found');
    }

    return { data: category.toJSON() };
  }

  @ApiCreatedResponse({
    description: 'The category was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(CategoryEntity) },
      },
    },
  })
  @ApiConflictResponse({
    description: 'A previous category was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.CREATE)
  @Post()
  public async create(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<AppResponse<CategoryEntity>> {
    const newCategory = await this.categoryService.create(categoryData);

    return { data: newCategory.toJSON() };
  }

  @ApiOkResponse({
    description: 'The category was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(CategoryEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.UPDATE)
  @Put(':id')
  public async overwrite(
    @Param('id') id: string,
    @Body() categoryData: CreateCategoryDto,
  ): Promise<AppResponse<CategoryEntity>> {
    const updatedCategory = await this.categoryService.overwrite(
      id,
      categoryData,
    );

    if (!updatedCategory) {
      throw new NotFoundException();
    }

    return { data: updatedCategory.toJSON() };
  }

  @ApiOkResponse({
    description: 'The category was updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(CategoryEntity) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Scopes(AppScopes.UPDATE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    categoryData: PatchCategoryDto,
  ): Promise<AppResponse<CategoryEntity>> {
    const updatedCategory = await this.categoryService.update(id, categoryData);

    if (!updatedCategory) {
      throw new NotFoundException();
    }

    return { data: updatedCategory.toJSON() };
  }

  @ApiOkResponse({
    description: 'The category was overwrite successfully',
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
  @Scopes(AppScopes.DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<AppResponse<number>> {
    const { deleted } = await this.categoryService.remove(id);

    return { data: deleted };
  }
}
