import { ApiResponse } from '../interfaces/api-response.interface';

export class CollectionResponse<T> implements ApiResponse<T> {
  data: {
    items: T;
  };
}
