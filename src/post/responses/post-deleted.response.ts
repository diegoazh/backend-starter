import { ApiResponse } from '../../shared/interfaces/api.response';

export class PostDeletedResponse implements ApiResponse<{ deleted: number }> {
  data: {
    posts: {
      deleted: number;
    };
  };
}
