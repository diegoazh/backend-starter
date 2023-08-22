import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { WrapperType } from '../shared/types';
import { PostExtendedModel } from '../shared/utils';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { PostTagEntity } from './post-tag.entity';
import { PostEntity } from './post.entity';

export interface ITagAttributes extends IBaseAttributes {
  name: string;
}

interface ITagCreationAttributes
  extends Optional<
    ITagAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'Tags' })
export class TagEntity extends BaseEntity<
  ITagAttributes,
  ITagCreationAttributes
> {
  @ApiProperty()
  @Field(() => String!)
  @Column
  name: string;

  @ApiProperty({
    type: () => [PostExtendedModel],
  })
  @Field(() => [PostEntity]!)
  @BelongsToMany(() => PostEntity, () => PostTagEntity)
  posts: WrapperType<PostEntity & { PostTagEntity: PostTagEntity }>[];

  @Field(() => PostTagEntity, { nullable: true })
  PostTagEntity?: WrapperType<PostTagEntity>;
}
