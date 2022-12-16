import { Column, ForeignKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { IPostAttributes, PostEntity } from './post.entity';
import { TagEntity } from './tag.entity';

export interface IPostTagAttributes extends IBaseAttributes {
  postId: string;
  tagId: string;
}

interface IPostTagCreationAttributes
  extends Optional<
    IPostAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'PostsTags' })
export class PostTagEntity extends BaseEntity<
  IPostTagAttributes,
  IPostTagCreationAttributes
> {
  @ForeignKey(() => PostEntity)
  @Column
  postId: string;

  @ForeignKey(() => TagEntity)
  @Column
  tagId: string;
}
