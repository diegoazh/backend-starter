import { ApiResponse } from '../../shared/interfaces/api.response';

export class ProfileDeletedResponse
  implements ApiResponse<{ deleted: number }>
{
  data: {
    profiles: {
      deleted: number;
    };
  };
}
