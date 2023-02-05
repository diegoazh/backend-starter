import { ApiResponse } from '../interfaces/api-response.interface';

export class EntityResponse<T> implements ApiResponse<T> {
  data: {
    item: T;
  };
}
