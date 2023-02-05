import { IApiResponse } from '../interfaces/api-response.interface';

export class EntityResponse<T> implements IApiResponse<T> {
  data: {
    item: T;
  };
}
