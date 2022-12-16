import { Column, HasMany, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { PostEntity } from './post.entity';

export interface ICategoryAttributes extends IBaseAttributes {
  name: string;
}

interface ICategoryCreationAttributes
  extends Optional<
    ICategoryAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'Categories' })
export class CategoryEntity extends BaseEntity<
  ICategoryAttributes,
  ICategoryCreationAttributes
> {
  @Column
  name: string;

  @HasMany(() => PostEntity)
  posts: PostEntity[];
}