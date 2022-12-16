import { ApiResponse } from '../../shared/interfaces/api.response';
import { CategoryModel } from './category-swagger.model';

export class CategoriesResponse implements ApiResponse<CategoryModel[]> {
  data: {
    categories: CategoryModel[];
  };
}
