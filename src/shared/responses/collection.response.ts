import { IApiResponse } from '../interfaces/api-response.interface';

export class CollectionResponse<T> implements IApiResponse<T> {
  data: {
    items: T;
  };
}
