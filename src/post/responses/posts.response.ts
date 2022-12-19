import { PostEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';
// import { PostModel } from './post-swagger.model';

export class PostsResponse implements ApiResponse<PostEntity[]> {
  data: {
    posts: PostEntity[];
  };
}
