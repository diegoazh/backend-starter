import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
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
import { PostType } from '../blog/constants/blog.constant';
import { WrapperType } from '../shared/types/app.type';
import { TagExtendedModel } from '../shared/utils';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';
import { PostTagEntity } from './post-tag.entity';
import { TagEntity } from './tag.entity';

registerEnumType(PostType, {
  name: 'PostType',
});

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

@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'Posts' })
export class PostEntity extends BaseEntity<
  IPostAttributes,
  IPostCreationAttributes
> {
  @ApiProperty()
  @Field(() => String!)
  @Column
  title: string;

  @ApiProperty()
  @Field(() => String!)
  @Column
  content: string;

  @ApiProperty()
  @Field(() => String!)
  @Column
  mainImage: string;

  @ApiProperty()
  @Field(() => String, { nullable: true })
  @Column
  images?: string;

  @ApiProperty({ enum: Object.values(PostType) })
  @Field(() => PostType)
  @Column({
    type: DataType.ENUM,
    values: Object.values(PostType),
  })
  type: (typeof PostType)[keyof typeof PostType];

  @ApiProperty()
  @Field(() => Boolean!)
  @Column
  published: boolean;

  @ApiProperty()
  @Field(() => String!)
  @ForeignKey(() => ProfileEntity)
  authorId: string;

  @Field(() => ProfileEntity, { nullable: true })
  @BelongsTo(() => ProfileEntity)
  author: WrapperType<ProfileEntity>;

  @ApiProperty()
  @Field(() => String!)
  @ForeignKey(() => CategoryEntity)
  categoryId: string;

  @Field(() => CategoryEntity, { nullable: true })
  @BelongsTo(() => CategoryEntity)
  category: WrapperType<CategoryEntity>;

  @ApiProperty({ type: () => [TagExtendedModel] })
  @Field(() => [TagEntity]!)
  @BelongsToMany(() => TagEntity, () => PostTagEntity)
  tags: WrapperType<
    TagEntity & { PostTagEntity: WrapperType<PostTagEntity> }
  >[];

  @ApiProperty({ type: () => [CommentEntity] })
  @Field(() => [CommentEntity!]!)
  @HasMany(() => CommentEntity)
  comments: WrapperType<CommentEntity[]>;

  @Field(() => PostTagEntity, { nullable: true })
  PostTagEntity?: WrapperType<PostTagEntity>;
}
