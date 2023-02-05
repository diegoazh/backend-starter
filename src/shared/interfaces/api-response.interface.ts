import { DataResponseKeys } from '../enums/app.enums';

export interface ApiResponse<T> {
  links?: {
    self: string;
    prev?: string;
    next?: string;
    last?: string;
  };

  data: { [key in DataResponseKeys]?: T };

  errors?: any[];
}
