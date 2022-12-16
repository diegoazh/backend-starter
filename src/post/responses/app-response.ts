import { Type } from '@nestjs/common';

export function AppResponse<T>(
  entity: string,
  type: Type<T>,
): {
  data: {
    [x: string]: Type<T>;
  };
} {
  return { data: { [entity]: type } };
}
