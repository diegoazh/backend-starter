import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';

export interface ICommentAttributes extends IBaseAttributes {
  content: string;
}

interface ICommentCreationAttributes
  extends Optional<
    ICommentAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'Comments' })
export class CommentEntity extends BaseEntity<
  ICommentAttributes,
  ICommentCreationAttributes
> {
  @ApiProperty()
  @Column
  content: string;

  @ApiProperty()
  @ForeignKey(() => ProfileEntity)
  authorId: string;

  @BelongsTo(() => ProfileEntity)
  author: ProfileEntity;

  @ApiProperty()
  @ForeignKey(() => PostEntity)
  postId: string;

  @BelongsTo(() => PostEntity)
  post: PostEntity;
}
