import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const MOTIVATION_EVENT_TYPES = [
  'page_view',
  'page_time_30s',
  'page_time_60s',
  'scroll_50',
  'scroll_80',
  'leadership_view',
  'project_view',
  'event_view',
  'gallery_open',
  'join_page_view',
  'join_cta_click',
  'learn_more_click',
  'join_form_start',
  'join_form_submit',
  'contact_submit',
  'return_visit',
  'first_visit',
] as const;

export class MotivationStartSessionDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsString()
  @MaxLength(120)
  sessionToken: string;

  @IsOptional()
  @IsString()
  pagePath?: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsString()
  browserInfo?: string;
}

export class MotivationTrackEventDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsString()
  @MaxLength(120)
  sessionToken: string;

  @IsOptional()
  @IsString()
  pagePath?: string;

  @IsIn(MOTIVATION_EVENT_TYPES)
  eventType: (typeof MOTIVATION_EVENT_TYPES)[number];

  @IsOptional()
  @IsString()
  eventLabel?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class MotivationEndSessionDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsString()
  @MaxLength(120)
  sessionToken: string;
}

export class MotivationStatusQueryDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsString()
  @MaxLength(120)
  sessionToken: string;
}

export class MotivationAdminSessionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxScore?: number;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsBooleanString()
  converted?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sortDir?: 'ASC' | 'DESC' | 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number;
}
