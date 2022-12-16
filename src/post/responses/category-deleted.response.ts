import { ApiResponse } from '../../shared/interfaces/api.response';

export class CategoryDeletedResponse
  implements ApiResponse<{ deleted: number }>
{
  data: {
    categories: {
      deleted: number;
    };
  };
}
