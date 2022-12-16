import { ApiResponse } from '../../shared/interfaces/api.response';
import { ProfileModel } from './profile-swagger.model';

export class ProfileResponse implements ApiResponse<ProfileModel> {
  data: {
    profile: ProfileModel;
  };
}
