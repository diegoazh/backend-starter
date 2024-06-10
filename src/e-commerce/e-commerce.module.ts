import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductCategoryEntity, ProductEntity, StockEntity } from '../models';
import { SharedModule } from '../shared/shared.module';
import { ProductController } from './controllers/product.controller';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductCategoryService } from './services/product-category.service';
import { ProductService } from './services/product.service';
import { ProductCategoryController } from './controllers/product-category.controller';
import { ProductCategoryResolver } from './resolvers/product-category.resolver';
import { StockService } from './services/stock.service';
import { StockController } from './controllers/stock.controller';
import { StockResolver } from './resolvers/stock.resolver';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductEntity,
      ProductCategoryEntity,
      StockEntity,
    ]),
    SharedModule,
  ],
  controllers: [ProductController, ProductCategoryController, StockController],
  providers: [
    ProductService,
    ProductResolver,
    ProductCategoryService,
    ProductCategoryResolver,
    StockService,
    StockResolver,
  ],
})
export class ECommerceModule {}
