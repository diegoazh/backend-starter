import { ProfileEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class ProfilesResponse implements ApiResponse<ProfileEntity[]> {
  data: {
    profiles: ProfileEntity[];
  };
}
