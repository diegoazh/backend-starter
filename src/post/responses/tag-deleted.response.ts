import { ApiResponse } from '../../shared/interfaces/api.response';

export class TagDeletedResponse implements ApiResponse<{ deleted: number }> {
  data: {
    tags: {
      deleted: number;
    };
  };
}
