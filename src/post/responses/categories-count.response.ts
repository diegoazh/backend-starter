import { ApiResponse } from '../../shared/interfaces/api.response';

export class CategoriesCountResponse implements ApiResponse<{ count: number }> {
  data: {
    categories: {
      count: number;
    };
  };
}
