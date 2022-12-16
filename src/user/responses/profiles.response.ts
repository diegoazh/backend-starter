import { ApiResponse } from '../../shared/interfaces/api.response';
import { ProfileModel } from './profile-swagger.model';

export class ProfilesResponse implements ApiResponse<ProfileModel[]> {
  data: {
    profiles: ProfileModel[];
  };
}
