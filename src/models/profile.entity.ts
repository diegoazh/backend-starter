import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { IBaseAttributes, BaseEntity, UserEntity } from '.';

export interface IProfileAttributes extends IBaseAttributes {
  bio?: string;
  firstName?: string;
  lastName?: string;
  userId: string;
}

interface IProfileCreationAttributes
  extends Optional<
    IProfileAttributes,
    | 'id'
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
  @Column
  bio?: string;

  @Column
  firstName?: string;

  @Column
  lastName?: string;

  @ForeignKey(() => UserEntity)
  userId: string;

  @BelongsTo(() => UserEntity)
  user: UserEntity;
}
