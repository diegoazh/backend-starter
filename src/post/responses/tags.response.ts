import { ApiResponse } from '../../shared/interfaces/api.response';
import { TagModel } from './tag-swagger.model';

export class TagsResponse implements ApiResponse<TagModel[]> {
  data: {
    tags: TagModel[];
  };
}
