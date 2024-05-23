import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductCategoryEntity, ProductEntity } from '../models';
import { SharedModule } from '../shared/shared.module';
import { ProductController } from './controllers/product.controller';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductCategoryService } from './services/product-category.service';
import { ProductService } from './services/product.service';
import { ProductCategoryController } from './controllers/product-category.controller';
import { ProductCategoryResolver } from './resolvers/product-category.resolver';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductEntity, ProductCategoryEntity]),
    SharedModule,
  ],
  controllers: [ProductController, ProductCategoryController],
  providers: [
    ProductService,
    ProductResolver,
    ProductCategoryService,
    ProductCategoryResolver,
  ],
})
export class ECommerceModule {}
