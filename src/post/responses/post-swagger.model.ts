import { ApiProperty } from '@nestjs/swagger';
import { IPostAttributes } from '../../models';
import { PostType } from '../constants/post.constant';

export abstract class PostModel implements IPostAttributes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty({ enum: Object.values(PostType) })
  type: typeof PostType[keyof typeof PostType];

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  mainImage: string;

  @ApiProperty()
  images?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
