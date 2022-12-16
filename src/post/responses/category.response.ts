import { ApiResponse } from '../../shared/interfaces/api.response';
import { CategoryModel } from './category-swagger.model';

export class CategoryResponse implements ApiResponse<CategoryModel> {
  data: {
    category: CategoryModel;
  };
}
