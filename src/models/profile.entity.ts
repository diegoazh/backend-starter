import { ApiProperty } from '@nestjs/swagger';
import { Column, HasMany, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, CommentEntity, IBaseAttributes, PostEntity } from '.';
import { LoggedUserModel } from '../user/models';
import { WrapperType } from '../shared/types';

export interface IProfileAttributes extends IBaseAttributes {
  image?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  userId: string;
}

interface IProfileCreationAttributes
  extends Optional<
    IProfileAttributes,
    | 'id'
    | 'image'
    | 'bio'
    | 'firstName'
    | 'lastName'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

@Table({ tableName: 'Profiles' })
export class ProfileEntity extends BaseEntity<
  IProfileAttributes,
  IProfileCreationAttributes
> {
  @ApiProperty()
  @Column
  image?: string;

  @ApiProperty()
  @Column
  bio?: string;

  @ApiProperty()
  @Column
  firstName?: string;

  @ApiProperty()
  @Column
  lastName?: string;

  @ApiProperty({ type: () => [CommentEntity] })
  @HasMany(() => CommentEntity)
  comments: WrapperType<CommentEntity>[];

  @ApiProperty({ type: () => [PostEntity] })
  @HasMany(() => PostEntity)
  posts: WrapperType<PostEntity>[];

  @ApiProperty()
  @Column
  userId: string;

  user?: WrapperType<LoggedUserModel>;
}
