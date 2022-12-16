import { ApiResponse } from '../../shared/interfaces/api.response';
import { UserModel } from './user-swagger.model';

export class UsersResponse implements ApiResponse<UserModel[]> {
  data: {
    users: UserModel[];
  };
}
