import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'sequelize';
import { ProductEntity } from '../../models';
import { IAppQueryString } from '../interfaces';

/**
 * GraphQL API
 */
export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(OrderDirection, { name: 'OrderDirection' });

@InputType()
class AppQueryInput implements IAppQueryString {
  @Field({ nullable: true })
  pageSize?: number;

  @Field({ nullable: true })
  pageIndex?: number;

  @Field(() => [String!, OrderDirection!], { nullable: true })
  order?: Order;
}

@InputType()
export class ProductQueryInput extends AppQueryInput {
  @Field(() => ProductEntity, { nullable: true })
  filter?: ProductEntity;
}
