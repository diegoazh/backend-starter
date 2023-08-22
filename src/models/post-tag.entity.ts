import { ApiProperty } from '@nestjs/swagger';
import { Column, ForeignKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { IPostAttributes, PostEntity } from './post.entity';
import { TagEntity } from './tag.entity';
import { Field, InterfaceType } from '@nestjs/graphql';

export interface IPostTagAttributes extends IBaseAttributes {
  postId: string;
  tagId: string;
}

interface IPostTagCreationAttributes
  extends Optional<
    IPostAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@InterfaceType({ implements: () => [BaseEntity] })
@Table({ tableName: 'PostsTags' })
export class PostTagEntity extends BaseEntity<
  IPostTagAttributes,
  IPostTagCreationAttributes
> {
  @ApiProperty()
  @Field(() => String)
  @ForeignKey(() => PostEntity)
  @Column
  postId: string;

  @ApiProperty()
  @Field(() => String)
  @ForeignKey(() => TagEntity)
  @Column
  tagId: string;
}
