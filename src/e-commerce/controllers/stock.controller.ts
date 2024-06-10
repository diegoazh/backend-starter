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
import { StockEntity } from '../../models';
import { AppResources, AppScopes } from '../../shared/constants';
import { IAppQueryString } from '../../shared/interfaces';
import { AppPaginatedResponse, AppResponse } from '../../shared/responses';
import { parseErrorsToHttpErrors } from '../../shared/utils';
import { CreateStockDto } from '../dtos';
import { StockService } from '../services/stock.service';

@ApiTags('Stocks controller')
@Resource(AppResources.STOCKS)
@Controller('stocks')
export class StockController {
  private readonly logger = new Logger(StockController.name);

  constructor(private readonly stockService: StockService) {}

  @ApiOkResponse({
    description: 'A list of stock',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(StockEntity) },
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
  ): Promise<AppResponse<StockEntity[]>> {
    try {
      const stocks = await this.stockService.find(query);

      return {
        data: stocks.map((stock) => stock.toJSON()),
      };
    } catch (error) {
      this.logger.error(`STOCK_FIND: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiOkResponse({
    description: 'Returns the total count of all stocks by criteria',
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
      const { count } = await this.stockService.count(query);

      return { data: count };
    } catch (error) {
      this.logger.error(`STOCK_COUNT: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiFoundResponse({
    description: 'A stock object that match with the provided id',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(StockEntity) },
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
  ): Promise<AppResponse<StockEntity>> {
    try {
      const stock = await this.stockService.findById(id);

      if (!stock) {
        throw new NotFoundException(errors['stock_exception_not-found'], {
          cause: new Error(errors['stock_exception_not-found']),
          description: errors['stock_exception_not-found'],
        });
      }

      return { data: stock.toJSON() };
    } catch (error) {
      this.logger.error(`STOCK_BY_ID: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiCreatedResponse({
    description: 'A stock was created successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(StockEntity) },
      },
    },
  })
  @ApiConflictResponse({
    description: 'when stock already exists with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(
    @Body() data: CreateStockDto,
  ): Promise<AppResponse<StockEntity>> {
    try {
      const product = await this.stockService.create(data);

      return { data: product.toJSON() };
    } catch (error) {
      this.logger.error(`STOCK_CREATE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The stock was overwrite successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(StockEntity) },
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
    @Body() data: CreateStockDto,
  ): Promise<AppResponse<StockEntity>> {
    try {
      const updatedProduct = await this.stockService.overwrite(id, data);

      if (!updatedProduct) {
        throw new NotFoundException(errors['stock_exception_not-found'], {
          cause: new Error(errors['stock_exception_not-found']),
          description: errors['stock_exception_not-found'],
        });
      }

      return { data: updatedProduct };
    } catch (error) {
      this.logger.error(`STOCK_OVERWRITE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }

  @ApiAcceptedResponse({
    description: 'The stock was updated successfully',
    schema: {
      properties: {
        data: { $ref: getSchemaPath(StockEntity) },
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
    @Body() data: Partial<CreateStockDto>,
  ): Promise<AppResponse<StockEntity>> {
    try {
      const updatedProduct = await this.stockService.update(id, data);

      if (!updatedProduct) {
        throw new NotFoundException(errors['stock_exception_not-found'], {
          cause: new Error(errors['stock_exception_not-found']),
          description: errors['stock_exception_not-found'],
        });
      }

      return { data: updatedProduct };
    } catch (error) {
      this.logger.error(`STOCK_UPDATE: ${error}`);
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
      const result = await this.stockService.remove(id);

      if (!result) {
        throw new NotFoundException(errors['stock_exception_not-found'], {
          cause: new Error(errors['stock_exception_not-found']),
          description: errors['stock_exception_not-found'],
        });
      }

      return { data: result.deleted };
    } catch (error) {
      this.logger.error(`STOCK_REMOVE: ${error}`);
      throw parseErrorsToHttpErrors(error);
    }
  }
}
