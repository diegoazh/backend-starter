import { ApiResponse } from '../../shared/interfaces/api.response';

export class PostsCountResponse implements ApiResponse<{ count: number }> {
  data: {
    posts: {
      count: number;
    };
  };
}
