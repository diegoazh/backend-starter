import { ApiResponse } from '../interfaces/api-response.interface';

export class CountResponse implements ApiResponse<number> {
  data: {
    count: number;
  };
}
