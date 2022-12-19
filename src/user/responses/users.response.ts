import { UserEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class UsersResponse implements ApiResponse<UserEntity[]> {
  data: {
    users: UserEntity[];
  };
}
