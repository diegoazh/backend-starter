import { CategoryEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class CategoriesResponse implements ApiResponse<CategoryEntity[]> {
  data: {
    categories: CategoryEntity[];
  };
}
