import { Column, DataType, HasMany, HasOne, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { UserRole } from '../user/constants/user.constant';
import { IBaseAttributes, BaseEntity, PostEntity, ProfileEntity } from '.';
import { CommentEntity } from './comment.entity';
import { UserModel } from '../user/responses/user-swagger.model';

export interface IUserAttributes extends IBaseAttributes {
  email: string;
  password: string;
  role: typeof UserRole[keyof typeof UserRole];
  username?: string;
  image?: string;
}

interface IUserCreationAttributes
  extends Optional<
    IUserAttributes,
    'id' | 'username' | 'image' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'Users' })
export class UserEntity extends BaseEntity<
  IUserAttributes,
  IUserCreationAttributes
> {
  @Column
  email: string;

  @Column
  password: string;

  @Column({ type: DataType.ENUM, values: Object.values(UserRole) })
  role: typeof UserRole[keyof typeof UserRole];

  @Column
  username?: string;

  @Column
  image?: string;

  @HasOne(() => ProfileEntity)
  profile: ProfileEntity;

  @HasMany(() => PostEntity)
  posts: PostEntity[];

  @HasMany(() => CommentEntity)
  comments: CommentEntity[];

  toJSON(): UserModel {
    return { ...super.toJSON(), password: '' };
  }
}
