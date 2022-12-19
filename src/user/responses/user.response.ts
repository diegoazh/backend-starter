import { UserEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class UserResponse implements ApiResponse<UserEntity> {
  data: {
    user: UserEntity;
  };
}
