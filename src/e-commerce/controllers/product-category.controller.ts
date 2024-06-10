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
  ApiAcceptedResponse,
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
import errors from '../../../errors/errors_messages.json';
import { ProductCategoryEntity } from '../../models';
import { AppResources, AppScopes } from '../../shared/constants';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { parseErrorsToHttpErrors } from '../../shared/utils';
import { CreateProductCategoryDto } from '../dtos';
import { ProductCategoryService } from '../services/product-category.service';

@ApiTags('ProductsCategories controller')
@Resource(AppResources.PRODUCT)
@Controller('product-categories')
export class ProductCategoryController {
  private readonly logger = new Logger(ProductCategoryController.name);

  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiOkResponse({
    description: 'A list of product categories',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ProductCategoryEntity) },
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
  ): Promise<AppResponse<ProductCategoryEntity[]>> {
    try {
      const productCategories = await this.productCategoryService.find(query);

      return {
        data: productCategories.map((category) => category.toJSON()),
      };
    } catch (error) {
      this.logger.error(`PRODUCT_CATEGORY_FIND: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description:
      'Returns the total count of all product categories by criteria',
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
  public async count(
    @Query() query?: IAppQueryString,
  ): Promise<AppResponse<number>> {
    try {
      const { count } = await this.productCategoryService.count(query);

      return { data: count };
    } catch (error) {
      this.logger.error(`PRODUCT_CATEGORY_COUNT: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiFoundResponse({
    description: 'A product category object that match with the provided id',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductCategoryEntity) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Product category not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  public async findById(
    @Param() id: string,
  ): Promise<AppResponse<ProductCategoryEntity>> {
    try {
      const category = await this.productCategoryService.findById(id);

      if (!category) {
        throw new NotFoundException(
          errors['product_category_exception_not-found'],
          {
            cause: new Error(errors['product_category_exception_not-found']),
            description: errors['product_category_exception_not-found'],
          },
        );
      }

      return { data: category.toJSON() };
    } catch (error) {
      this.logger.error(`PRODUCT_CATEGORY_BY_ID: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiCreatedResponse({
    description: 'A product category was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductCategoryEntity) },
      },
    },
  })
  @ApiConflictResponse({
    description:
      'when product category already exists with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(@Body() data: CreateProductCategoryDto): Promise<any> {
    try {
      const category = await this.productCategoryService.create(data);

      return { data: category.toJSON() };
    } catch (error) {
      this.logger.error(`PRODUCT_CATEGORY_CREATE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The product category was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductCategoryEntity) },
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
  public async overwrite(
    @Param('id') id: string,
    @Body() data: CreateProductCategoryDto,
  ): Promise<AppResponse<ProductCategoryEntity>> {
    try {
      const updatedProductCategory =
        await this.productCategoryService.overwrite(id, data);

      if (!updatedProductCategory) {
        throw new NotFoundException(
          errors['product_category_exception_not-found'],
          {
            cause: new Error(errors['product_category_exception_not-found']),
            description: errors['product_category_exception_not-found'],
          },
        );
      }

      return { data: updatedProductCategory };
    } catch (error) {
      this.logger.error(`PRODUCT_CATEGORY_OVERWRITE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The product category was updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductCategoryEntity) },
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
  public async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateProductCategoryDto>,
  ): Promise<AppResponse<ProductCategoryEntity>> {
    try {
      const updatedProductCategory = await this.productCategoryService.update(
        id,
        data,
      );

      if (!updatedProductCategory) {
        throw new NotFoundException(
          errors['product_category_exception_not-found'],
          {
            cause: new Error(errors['product_category_exception_not-found']),
            description: errors['product_category_exception_not-found'],
          },
        );
      }

      return { data: updatedProductCategory };
    } catch (error) {
      this.logger.error(`PRODUCT_CATEGORY_UPDATE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'A product category was removed successfully',
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
      const result = await this.productCategoryService.remove(id);

      if (!result) {
        throw new NotFoundException(
          errors['product_category_exception_not-found'],
          {
            cause: new Error(errors['product_category_exception_not-found']),
            description: errors['product_category_exception_not-found'],
          },
        );
      }

      return { data: result.deleted };
    } catch (error) {
      this.logger.error(`PRODUCT_CATEGORY_REMOVE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }
}
