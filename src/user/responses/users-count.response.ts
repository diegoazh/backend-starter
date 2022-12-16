import { ApiResponse } from '../../shared/interfaces/api.response';

export class UsersCountResponse implements ApiResponse<{ count: number }> {
  data: {
    users: {
      count: number;
    };
  };
}
