import { ApiResponse } from '../../shared/interfaces/api.response';
import { UserModel } from './user-swagger.model';

export class UserResponse implements ApiResponse<UserModel> {
  data: {
    user: UserModel;
  };
}
