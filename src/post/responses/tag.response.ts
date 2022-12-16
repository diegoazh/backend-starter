import { ApiResponse } from '../../shared/interfaces/api.response';
import { TagModel } from './tag-swagger.model';

export class TagResponse implements ApiResponse<TagModel> {
  data: {
    tag: TagModel;
  };
}
