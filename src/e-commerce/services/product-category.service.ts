import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategoryEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { buildPartialFindOptions } from '../../shared/utils/fns';
import { CreateProductCategoryDto } from '../dtos';

@Injectable()
export class ProductCategoryService {
  private readonly logger = new Logger(ProductCategoryService.name);

  constructor(
    @InjectModel(ProductCategoryEntity)
    private readonly ProductCategory: typeof ProductCategoryEntity,
  ) {}

  public find(query: IAppQueryString = {}): Promise<ProductCategoryEntity[]> {
    const { pageSize = 0, pageIndex = 0, filter = {}, order } = query;

    this.logger.log(
      `pageSize: [${pageSize}], pageIndex: [${pageIndex}], filter: [${JSON.stringify(
        filter,
        null,
        2,
      )}], order: [${JSON.stringify(order)}]`,
    );

    return this.ProductCategory.findAll({
      ...buildPartialFindOptions<ProductCategoryEntity>({
        pageIndex,
        pageSize,
      }),
      where: {
        ...filter,
      },
      order,
      attributes: {
        exclude: ['deletedAt'],
      },
    });
  }

  public findById(id: string): Promise<ProductCategoryEntity | null> {
    this.logger.log(`id: [${id}]`);

    return this.ProductCategory.findByPk(id);
  }

  public async count(query: IAppQueryString = {}): Promise<{ count: number }> {
    const { filter } = query;

    this.logger.log(`filter: [${JSON.stringify(filter, null, 2)}]`);

    const count = await this.ProductCategory.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create(
    data: CreateProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    return this.ProductCategory.create({
      ...data,
    });
  }

  public async overwrite(
    id: string,
    data: CreateProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    const productCategory = await this.findById(id);

    if (productCategory) {
      Object.keys(productCategory.toJSON()).forEach((key) => {
        productCategory[key] = data[key];
      });
      productCategory.updatedAt = new Date();

      await productCategory.save();
    }

    return productCategory;
  }

  public async update(
    id: string,
    data: Partial<CreateProductCategoryDto>,
  ): Promise<ProductCategoryEntity> {
    const productCategory = await this.findById(id);

    if (productCategory) {
      Object.keys(productCategory.toJSON()).forEach((key) => {
        productCategory[key] =
          data[key] != null ? data[key] : productCategory[key];
      });
      productCategory.updatedAt = new Date();

      await productCategory.save();
    }

    return productCategory;
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const product = await this.findById(id);

    if (product) {
      await product.destroy();

      return { deleted: 1 };
    }

    return { deleted: 0 };
  }
}
