import { ApiResponse } from '../../shared/interfaces/api.response';

export class UserDeletedResponse implements ApiResponse<{ deleted: number }> {
  data: {
    users: {
      deleted: number;
    };
  };
}
