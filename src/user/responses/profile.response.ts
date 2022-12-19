import { ProfileEntity } from '../../models';
import { ApiResponse } from '../../shared/interfaces/api.response';

export class ProfileResponse implements ApiResponse<ProfileEntity> {
  data: {
    profile: ProfileEntity;
  };
}
