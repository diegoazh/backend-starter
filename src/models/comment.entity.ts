import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

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
  @Column
  content: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @ForeignKey(() => PostEntity)
  postId: string;

  @BelongsTo(() => PostEntity)
  post: PostEntity;
}
