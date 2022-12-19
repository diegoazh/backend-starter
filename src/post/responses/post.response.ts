import { PostEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class PostResponse implements ApiResponse<PostEntity> {
  data: {
    post: PostEntity;
  };
}
