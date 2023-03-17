export interface IApiResponse<T> {
  links?: {
    self: string;
    prev?: string;
    next?: string;
    last?: string;
  };

  data: T;
}
