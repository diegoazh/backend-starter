import { TagEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class TagsResponse implements ApiResponse<TagEntity[]> {
  data: {
    tags: TagEntity[];
  };
}
