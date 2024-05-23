import { Order } from 'sequelize/types';

/**
 * Rest API
 */
export interface IAppQueryString {
  pageSize?: number;
  pageIndex?: number;
  filter?: Record<string, any>;
  order?: Order;
}
