import { ApiResponse } from '../../shared/interfaces/api.response';

export class ProfilesCountResponse implements ApiResponse<{ count: number }> {
  data: {
    profiles: {
      count: number;
    };
  };
}
