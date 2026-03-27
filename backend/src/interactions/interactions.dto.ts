import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export const TARGET_TYPES = ['PROJECT', 'EVENT', 'GALLERY_ALBUM', 'MAGAZINE', 'POLL', 'NOTICE'] as const;

export class PublicInteractionQueryDto {
  @IsIn(TARGET_TYPES)
  targetType: (typeof TARGET_TYPES)[number];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetId: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  visitorToken?: string;
}

export class PublicReactionDto {
  @IsIn(TARGET_TYPES)
  targetType: (typeof TARGET_TYPES)[number];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetId: number;

  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsIn(['LIKE', 'DISLIKE'])
  reactionType: 'LIKE' | 'DISLIKE';
}

export class PublicCommentDto {
  @IsIn(TARGET_TYPES)
  targetType: (typeof TARGET_TYPES)[number];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetId: number;

  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  authorName?: string;

  @IsString()
  @MaxLength(2000)
  comment: string;
}

export class PublicShareDto {
  @IsIn(TARGET_TYPES)
  targetType: (typeof TARGET_TYPES)[number];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetId: number;

  @IsString()
  @MaxLength(120)
  visitorToken: string;
}

export class AdminCommentsQueryDto {
  @IsOptional()
  @IsIn(TARGET_TYPES)
  targetType?: (typeof TARGET_TYPES)[number];

  @IsOptional()
  @IsString()
  search?: string;
}
