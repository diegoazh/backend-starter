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
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';
import { CategoriesCountResponse } from '../responses/categories-count.response';
import { CategoriesResponse } from '../responses/categories.response';
import { CategoryDeletedResponse } from '../responses/category-deleted.response';
import { CategoryModel } from '../responses/category-swagger.model';
import { CategoryResponse } from '../responses/category.response';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories controller')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({
    type: CategoriesResponse,
    description: 'A list of categories',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  public async find(
    @Query() query?: IAppQueryString,
  ): Promise<CategoriesResponse> {
    const categories = await this.categoryService.find(query);

    return {
      data: {
        categories: categories.map(
          (category) => category.toJSON() as CategoryModel,
        ),
      },
    };
  }

  @ApiFoundResponse({
    type: CategoryResponse,
    description: 'A found category',
  })
  @ApiNotFoundResponse({ description: 'Any category was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<CategoryResponse> {
    const category = await this.categoryService.findById(id);

    if (!category) {
      throw new NotFoundException('category_exception_not_found');
    }

    return { data: { category: category.toJSON() as CategoryModel } };
  }

  @ApiOkResponse({
    type: CategoriesCountResponse,
    description: 'A sum of all categories in the system',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<CategoriesCountResponse> {
    const { count } = await this.categoryService.count(query);

    return { data: { categories: { count } } };
  }

  @ApiCreatedResponse({
    type: CategoryResponse,
    description: 'The category was created successfully',
  })
  @ApiConflictResponse({
    description: 'A previous category was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    const newCategory = await this.categoryService.create(categoryData);

    return { data: { category: newCategory.toJSON() as CategoryModel } };
  }

  @ApiOkResponse({
    type: CategoryResponse,
    description: 'The category was overwrite successfully',
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
    @Body() categoryData: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    const updatedCategory = await this.categoryService.overwrite(
      id,
      categoryData,
    );

    return { data: { category: updatedCategory.toJSON() as CategoryModel } };
  }

  @ApiOkResponse({
    type: CategoryResponse,
    description: 'The category was updated successfully',
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
    categoryData: PatchCategoryDto,
  ): Promise<CategoryResponse> {
    const updateCategory = await this.categoryService.update(id, categoryData);

    return { data: { category: updateCategory.toJSON() as CategoryModel } };
  }

  @ApiOkResponse({
    type: CategoryDeletedResponse,
    description: 'The category was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<CategoryDeletedResponse> {
    const { deleted } = await this.categoryService.remove(id);

    return { data: { categories: { deleted } } };
  }
}
