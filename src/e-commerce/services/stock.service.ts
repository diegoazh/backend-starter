import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ProductCategoryEntity,
  ProductEntity,
  StockEntity,
} from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { buildPartialFindOptions } from '../../shared/utils/fns';
import { CreateStockDto } from '../dtos';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectModel(StockEntity)
    private readonly Stock: typeof StockEntity,
  ) {}

  public async find(query: IAppQueryString = {}): Promise<StockEntity[]> {
    const { pageSize = 0, pageIndex = 0, filter = {} } = query;

    this.logger.log(
      `pageSize: [${pageSize}], pageIndex: [${pageIndex}], filter: [${JSON.stringify(
        filter,
        null,
        2,
      )}]`,
    );

    return this.Stock.findAll({
      ...buildPartialFindOptions<StockEntity>({ pageIndex, pageSize }),
      where: {
        ...filter,
      },
      attributes: {
        exclude: ['productId', 'deletedAt'],
      },
      include: [
        {
          model: ProductEntity,
          attributes: { exclude: ['productCategoryId'] },
          include: [{ model: ProductCategoryEntity }],
        },
      ],
    });
  }

  public async findById(id: string): Promise<StockEntity | null> {
    this.logger.log(`id: [${id}]`);

    return this.Stock.findByPk(id);
  }

  public async count(query: IAppQueryString = {}): Promise<{ count: number }> {
    const { filter } = query;

    this.logger.log(`filter: [${JSON.stringify(filter, null, 2)}]`);

    const count = await this.Stock.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public async create(data: CreateStockDto): Promise<StockEntity> {
    return this.Stock.create({ ...data });
  }

  public async overwrite(
    id: string,
    data: CreateStockDto,
  ): Promise<StockEntity | null> {
    const savedStock = await this.findById(id);

    if (savedStock) {
      Object.keys(data).forEach((key) => {
        savedStock[key] = data[key];
      });

      await savedStock.save();
    }

    return savedStock;
  }

  public async update(
    id: string,
    data: Partial<CreateStockDto>,
  ): Promise<StockEntity | null> {
    const savedStock = await this.findById(id);

    if (savedStock) {
      Object.keys(data).forEach((key) => {
        if (data[key] != null) {
          savedStock[key] = data[key];
        }
      });

      await savedStock.save();
    }

    return savedStock;
  }

  public async remove(id: string): Promise<{ deleted: number } | null> {
    const savedStock = await this.findById(id);

    if (savedStock) {
      await savedStock.destroy();

      return { deleted: 1 };
    }

    return savedStock;
  }
}
