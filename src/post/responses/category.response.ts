import { CategoryEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class CategoryResponse implements ApiResponse<CategoryEntity> {
  data: {
    category: CategoryEntity;
  };
}
