import { ApiProperty } from '@nestjs/swagger';
import { Column, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes } from '.';
import { LoggedUserEntity } from '../user/models';

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

  @ApiProperty()
  @Column
  userId: string;

  user?: LoggedUserEntity;
}
