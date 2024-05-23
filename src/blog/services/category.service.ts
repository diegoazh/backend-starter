import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryEntity, PostEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { buildPartialFindOptions } from '../../shared/utils/fns';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryEntity)
    private readonly Category: typeof CategoryEntity,
  ) {}

  public find(query: IAppQueryString): Promise<CategoryEntity[]> {
    const { filter, order, pageIndex = 0, pageSize = 0 } = query;

    return this.Category.findAll({
      ...buildPartialFindOptions<CategoryEntity>({ pageIndex, pageSize }),
      where: {
        ...filter,
      },
      include: [PostEntity],
      order,
    });
  }

  public findById(id: string): Promise<CategoryEntity | null> {
    return this.Category.findByPk(id);
  }

  public async count(query?: IAppQueryString): Promise<{ count: number }> {
    const { filter } = query;

    const count = await this.Category.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create({ name }: CreateCategoryDto): Promise<CategoryEntity> {
    return this.Category.create({
      name,
    });
  }

  public async overwrite(
    id: string,
    data: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const categoryFound = await this.findById(id);

    if (categoryFound) {
      categoryFound.set({ ...data });

      return categoryFound.save();
    }
  }

  public async update(
    id: string,
    data: PatchCategoryDto,
  ): Promise<CategoryEntity> {
    const categoryFound = await this.findById(id);

    if (categoryFound) {
      if (data.name) {
        categoryFound.set({ name: data.name });
      }

      return categoryFound.save();
    }
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const categoryFound = await this.findById(id);

    if (!categoryFound) {
      throw new NotFoundException('category_exception_not_found');
    }

    const deleted = await this.Category.destroy({ where: { id } });

    return { deleted };
  }
}
