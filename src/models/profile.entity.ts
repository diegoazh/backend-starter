import { ApiProperty } from '@nestjs/swagger';
import { Column, HasMany, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, CommentEntity, IBaseAttributes, PostEntity } from '.';
import { LoggedUserModel } from '../user/models';
import { WrapperType } from '../shared/types';
import { Field, ObjectType } from '@nestjs/graphql';

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

@ObjectType({ implements: () => [BaseEntity] })
@Table({ tableName: 'Profiles' })
export class ProfileEntity extends BaseEntity<
  IProfileAttributes,
  IProfileCreationAttributes
> {
  @ApiProperty()
  @Field(() => String, { nullable: true })
  @Column
  image?: string;

  @ApiProperty()
  @Field(() => String, { nullable: true })
  @Column
  bio?: string;

  @ApiProperty()
  @Field(() => String, { nullable: true })
  @Column
  firstName?: string;

  @ApiProperty()
  @Field(() => String, { nullable: true })
  @Column
  lastName?: string;

  @ApiProperty({ type: () => [CommentEntity] })
  @Field(() => [CommentEntity!]!)
  @HasMany(() => CommentEntity)
  comments: WrapperType<CommentEntity>[];

  @ApiProperty({ type: () => [PostEntity] })
  @Field(() => [PostEntity!]!)
  @HasMany(() => PostEntity)
  posts: WrapperType<PostEntity>[];

  @ApiProperty()
  @Field(() => String!)
  @Column
  userId: string;

  @Field(() => LoggedUserModel, { nullable: true })
  user?: WrapperType<LoggedUserModel>;
}
