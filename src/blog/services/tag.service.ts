import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostEntity, TagEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { buildPartialFindOptions } from '../../shared/utils/fns';
import { CreateTagDto } from '../dto/create-tag.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';

@Injectable()
export class TagService {
  constructor(@InjectModel(TagEntity) private readonly Tag: typeof TagEntity) {}

  public find(query: IAppQueryString): Promise<TagEntity[]> {
    const { filter, order, pageIndex = 0, pageSize = 0 } = query;

    return this.Tag.findAll({
      ...buildPartialFindOptions<TagEntity>({ pageSize, pageIndex }),
      where: {
        ...filter,
      },
      include: [PostEntity],
      order,
    });
  }

  public findById(id: string): Promise<TagEntity | null> {
    return this.Tag.findByPk(id);
  }

  public async count(query: IAppQueryString): Promise<{ count: number }> {
    const { filter = {} } = query;

    const count = await this.Tag.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create({ name }: CreateTagDto): Promise<TagEntity> {
    return this.Tag.create({
      name,
    });
  }

  public async overwrite(
    id: string,
    data: CreateTagDto,
  ): Promise<TagEntity | null> {
    const tagFound = await this.findById(id);

    if (tagFound) {
      tagFound.set({ ...data });
      await tagFound.save();
    }

    return tagFound;
  }

  public async update(
    id: string,
    data: PatchCategoryDto,
  ): Promise<TagEntity | null> {
    const tagFound = await this.findById(id);

    if (tagFound) {
      if (data.name) {
        tagFound.set({ name: data.name });
      }

      return tagFound.save();
    }

    return tagFound;
  }

  public async remove(id: string): Promise<{ deleted: number } | null> {
    const tagFound = await this.findById(id);

    if (!tagFound) return tagFound;

    const deleted = await this.Tag.destroy({ where: { id } });

    return { deleted };
  }
}
