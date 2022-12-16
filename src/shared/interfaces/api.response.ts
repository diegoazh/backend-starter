export interface ApiResponse<T, U = { [key: string]: T }> {
  links?: {
    self: string;
    prev?: string;
    next?: string;
    last?: string;
  };

  data: U;

  errors?: any[];
}
