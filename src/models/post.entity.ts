import { ApiProperty } from '@nestjs/swagger';
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
import { BaseEntity, IBaseAttributes, ProfileEntity } from '.';
import { PostType } from '../post/constants/post.constant';
import { TagExtendedModel } from '../shared/utils';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';
import { PostTagEntity } from './post-tag.entity';
import { TagEntity } from './tag.entity';
import { WrapperType } from '../shared/types/app.type';

export interface IPostAttributes extends IBaseAttributes {
  title: string;
  content: string;
  mainImage: string;
  images?: string;
  type: (typeof PostType)[keyof typeof PostType];
  published: boolean;
  authorId: string;
  categoryId: string;
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
  @ApiProperty()
  @Column
  title: string;

  @ApiProperty()
  @Column
  content: string;

  @ApiProperty()
  @Column
  mainImage: string;

  @ApiProperty()
  @Column
  images?: string;

  @ApiProperty({ enum: Object.values(PostType) })
  @Column({
    type: DataType.ENUM,
    values: Object.values(PostType),
  })
  type: (typeof PostType)[keyof typeof PostType];

  @ApiProperty()
  @Column
  published: boolean;

  @ApiProperty()
  @ForeignKey(() => ProfileEntity)
  authorId: string;

  @BelongsTo(() => ProfileEntity)
  author: WrapperType<ProfileEntity>;

  @ApiProperty()
  @ForeignKey(() => CategoryEntity)
  categoryId: string;

  @BelongsTo(() => CategoryEntity)
  category: WrapperType<CategoryEntity>;

  @ApiProperty({ type: () => [TagExtendedModel] })
  @BelongsToMany(() => TagEntity, () => PostTagEntity)
  tags: WrapperType<
    TagEntity & { PostTagEntity: WrapperType<PostTagEntity> }
  >[];

  @ApiProperty({ type: () => [CommentEntity] })
  @HasMany(() => CommentEntity)
  comments: WrapperType<CommentEntity[]>;
}
