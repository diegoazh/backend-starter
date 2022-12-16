import { ApiResponse } from '../../shared/interfaces/api.response';

export class TagsCountResponse implements ApiResponse<{ count: number }> {
  data: {
    tags: {
      count: number;
    };
  };
}
