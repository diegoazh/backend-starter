import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IApiResponse } from '../interfaces/api-response.interface';

export class PaginationLinks {
  @ApiProperty({ type: String })
  self: string;

  @ApiProperty({ type: String })
  prev?: string;

  @ApiProperty({ type: String })
  next?: string;

  @ApiProperty({ type: String })
  last?: string;
}

export class AppPaginatedResponse<T> implements IApiResponse<T> {
  @ApiPropertyOptional({
    type: () => PaginationLinks,
  })
  links?: PaginationLinks;

  @ApiProperty({
    type: Object,
  })
  data: T;
}

export class AppResponse<T> implements IApiResponse<T> {
  @ApiProperty({
    type: Object,
  })
  data: T;
}
