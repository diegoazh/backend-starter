import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';

export interface IBaseAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

@InterfaceType()
export abstract class BaseEntity<T extends {}, U extends {}> extends Model<
  T,
  U
> {
  @ApiProperty()
  @Field(() => ID!)
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty()
  @Field(() => String!)
  @CreatedAt
  createdAt: Date;

  @ApiProperty()
  @Field(() => String)
  @UpdatedAt
  updatedAt: Date;

  @ApiProperty()
  @Field(() => String)
  @DeletedAt
  deletedAt: Date;
}
