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
import { ProductEntity } from '../../models';
import { AppResources, AppScopes } from '../../shared/constants';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { parseErrorsToHttpErrors } from '../../shared/utils';
import { CreateProductDto, PatchProductDto, UpdateProductDto } from '../dtos';
import { ProductService } from '../services/product.service';

@ApiTags('Products controller')
@Resource(AppResources.PRODUCT)
@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({
    description: 'A list of products',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ProductEntity) },
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
  ): Promise<AppResponse<ProductEntity[]>> {
    try {
      const products = await this.productService.find(query);

      return {
        data: products.map((product) => product.toJSON()),
      };
    } catch (error) {
      this.logger.error(`PRODUCT_FIND: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'Returns the total count of all products by criteria',
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
      const { count } = await this.productService.count(query);

      return { data: count };
    } catch (error) {
      this.logger.error(`PRODUCT_COUNT: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiFoundResponse({
    description: 'A product object that match with the provided id',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductEntity) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  public async findById(
    @Param() id: string,
  ): Promise<AppResponse<ProductEntity>> {
    try {
      const product = await this.productService.findById(id);

      if (!product) {
        throw new NotFoundException('product_exception_not-found');
      }

      return { data: product.toJSON() };
    } catch (error) {
      this.logger.error(`PRODUCT_BY_ID: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiCreatedResponse({
    description: 'A product was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductEntity) },
      },
    },
  })
  @ApiConflictResponse({
    description: 'when product already exists with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(@Body() data: CreateProductDto): Promise<any> {
    try {
      const product = await this.productService.create(data);

      return { data: product.toJSON() };
    } catch (error) {
      this.logger.error(`PRODUCT_CREATE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The product was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductEntity) },
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
    @Body() data: UpdateProductDto,
  ): Promise<AppResponse<ProductEntity>> {
    try {
      const updatedProduct = await this.productService.overwrite(id, data);

      return { data: updatedProduct };
    } catch (error) {
      this.logger.error(`PRODUCT_OVERWRITE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The product was updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(ProductEntity) },
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
    @Body() data: PatchProductDto,
  ): Promise<AppResponse<ProductEntity>> {
    try {
      const updatedProduct = await this.productService.update(id, data);

      return { data: updatedProduct };
    } catch (error) {
      this.logger.error(`PRODUCT_UPDATE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'A product was removed successfully',
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
      const { deleted } = await this.productService.remove(id);

      return { data: deleted };
    } catch (error) {
      this.logger.error(`PRODUCT_REMOVE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }
}
