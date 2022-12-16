import { ApiResponse } from '../../shared/interfaces/api.response';
import { PostModel } from './post-swagger.model';

export class PostsResponse implements ApiResponse<PostModel[]> {
  data: {
    posts: PostModel[];
  };
}
