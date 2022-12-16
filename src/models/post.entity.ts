import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { PostType } from '../post/constants/post.constant';
import { BaseEntity, IBaseAttributes, UserEntity } from '.';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';
import { PostTagEntity } from './post-tag.entity';
import { TagEntity } from './tag.entity';

export interface IPostAttributes extends IBaseAttributes {
  title: string;
  content: string;
  mainImage: string;
  images?: string;
  type: typeof PostType[keyof typeof PostType];
  published: boolean;
  authorId: string;
}

interface IPostCreationAttributes
  extends Optional<
    IPostAttributes,
    'id' | 'mainImage' | 'images' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'Posts' })
export class PostEntity extends BaseEntity<
  IPostAttributes,
  IPostCreationAttributes
> {
  @Column
  title: string;

  @Column
  content: string;

  @Column
  mainImage: string;

  @Column
  images?: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PostType),
  })
  type: typeof PostType[keyof typeof PostType];

  @Column
  published: boolean;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @ForeignKey(() => CategoryEntity)
  categoryId: string;

  @BelongsTo(() => CategoryEntity)
  category: CategoryEntity;

  @BelongsToMany(() => TagEntity, () => PostTagEntity)
  tags: Array<TagEntity & { PostTagEntity: PostTagEntity }>;

  @HasMany(() => CommentEntity)
  comments: CommentEntity[];
}
