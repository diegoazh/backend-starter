import { ApiProperty } from '@nestjs/swagger';
import { IPostAttributes, ITagAttributes, PostTagEntity } from '../../models';
import { PostType } from '../../blog/constants/blog.constant';
import { WrapperType } from '../types';

export class TagExtendedModel implements ITagAttributes {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => PostTagEntity })
  PostTagEntity: WrapperType<PostTagEntity>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

export class PostExtendedModel implements IPostAttributes {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  mainImage: string;

  @ApiProperty()
  images?: string;

  @ApiProperty({ enum: Object.values(PostType) })
  type: (typeof PostType)[keyof typeof PostType];

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => PostTagEntity })
  PostTagEntity: WrapperType<PostTagEntity>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
