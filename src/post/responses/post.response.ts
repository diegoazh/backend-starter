import { ApiResponse } from '../../shared/interfaces/api.response';
import { PostModel } from './post-swagger.model';

export class PostResponse implements ApiResponse<PostModel> {
  data: {
    post: PostModel;
  };
}
