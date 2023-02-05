import { ApiResponse } from '../interfaces/api-response.interface';

export class DeleteResponse implements ApiResponse<number> {
  data: {
    deleted: number;
  };
}
