import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';
import { WrapperType } from '../shared/types/app.type';
import { Field, ObjectType } from '@nestjs/graphql';

export interface ICommentAttributes extends IBaseAttributes {
  content: string;
}

interface ICommentCreationAttributes
  extends Optional<
    ICommentAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'Comments' })
export class CommentEntity extends BaseEntity<
  ICommentAttributes,
  ICommentCreationAttributes
> {
  @ApiProperty()
  @Field(() => String!)
  @Column
  content: string;

  @ApiProperty()
  @Field(() => String!)
  @ForeignKey(() => ProfileEntity)
  authorId: string;

  @Field(() => ProfileEntity, { nullable: true })
  @BelongsTo(() => ProfileEntity)
  author: WrapperType<ProfileEntity>;

  @ApiProperty()
  @Field(() => String!)
  @ForeignKey(() => PostEntity)
  postId: string;

  @Field(() => PostEntity, { nullable: true })
  @BelongsTo(() => PostEntity)
  post: WrapperType<PostEntity>;
}
