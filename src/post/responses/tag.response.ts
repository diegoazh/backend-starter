import { TagEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class TagResponse implements ApiResponse<TagEntity> {
  data: {
    tag: TagEntity;
  };
}
